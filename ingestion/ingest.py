"""
ingest.py — UK Legal Aid RAG ingestion worker

Fetches verified UK legal aid sources, chunks them, embeds with OpenAI,
and upserts into Supabase pgvector. Marks stale chunks automatically.

Run: python ingest.py
Schedule: GitHub Actions cron (see .github/workflows/ingest.yml)
"""

import hashlib
import os
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from sources import SOURCES
from chunker import chunk_text

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
EMBEDDING_MODEL = "text-embedding-3-small"
CHUNK_SIZE = 512      # tokens (approximate via word count)
CHUNK_OVERLAP = 50

openai_client = OpenAI(api_key=OPENAI_API_KEY)

headers = {
    'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_ROLE_KEY
}


def fetch_page(url: str) -> tuple[str, str]:
    """Fetch a URL and return (plain text content, content hash)."""
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    # Remove nav/footer noise
    for tag in soup(["nav", "footer", "header", "script", "style"]):
        tag.decompose()
    text = soup.get_text(separator="\n", strip=True)
    content_hash = hashlib.sha256(text.encode()).hexdigest()
    return text, content_hash


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Batch embed a list of texts."""
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    return [item.embedding for item in response.data]


def get_or_create_document(source: dict, content_hash: str):
    now = datetime.now(timezone.utc).isoformat()
    
    # Check if document exists
    response = requests.get(
        f'{SUPABASE_URL}/rest/v1/documents',
        params={'select': 'id', 'source_url': f'eq.{source["url"]}'},
        headers=headers
    )
    response.raise_for_status()
    documents = response.json()
    
    payload = {
        "source_url": source["url"],
        "source_title": source["title"],
        "publication_date": source.get("publication_date"),
        "last_checked_at": now,
        "content_hash": content_hash,
        "is_retired": False,
    }

    if documents:
        # Update existing
        requests.patch(
            f'{SUPABASE_URL}/rest/v1/documents',
            params={'id': f'eq.{documents[0]["id"]}'},
            json=payload,
            headers=headers
        ).raise_for_status()
        return documents[0]["id"]
    else:
        # Insert new
        response = requests.post(
            f'{SUPABASE_URL}/rest/v1/documents',
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        return response.json()[0]["id"]


def get_next_chunk_version(document_id: str) -> int:
    response = requests.get(
        f'{SUPABASE_URL}/rest/v1/chunks',
        params={'select': 'version', 'document_id': f'eq.{document_id}', 'order': 'version.desc', 'limit': '1'},
        headers=headers
    )
    response.raise_for_status()
    existing = response.json()

    if existing:
        return int(existing[0]["version"] or 0) + 1

    return 1


def upsert_chunks(source: dict, chunks: list[str], embeddings: list[list[float]]):
    """Upsert chunks into Supabase, mark old chunks from same source as stale."""
    now = datetime.now(timezone.utc).isoformat()

    # Ensure document row exists and get document_id
    document_id = get_or_create_document(source, content_hash=source.get("content_hash", ""))

    # Mark existing chunks for this document as stale
    requests.patch(
        f'{SUPABASE_URL}/rest/v1/chunks',
        params={'document_id': f'eq.{document_id}'},
        json={"is_stale": True},
        headers=headers
    ).raise_for_status()

    # Set chunk version semantically per document update cycle
    version = get_next_chunk_version(document_id)

    # Insert fresh chunks
    rows = [
        {
            "document_id": document_id,
            "chunk_index": idx,
            "content": chunk,
            "embedding": embedding,
            "source_url": source["url"],
            "source_title": source["title"],
            "section": source.get("section"),
            "publication_date": source.get("publication_date"),
            "last_checked_at": now,
            "is_stale": False,
            "version": version,
        }
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ]
    response = requests.post(
        f'{SUPABASE_URL}/rest/v1/chunks',
        json=rows,
        headers=headers
    )
    response.raise_for_status()
    print(f"  ✓ Upserted {len(rows)} chunks from {source['title']} (version={version})")


def process_source(source: dict):
    print(f"Processing: {source['title']} ({source['url']})")
    try:
        text, content_hash = fetch_page(source["url"])

        # Attach hash for document row updates
        source["content_hash"] = content_hash

        # Check if content has changed since last run
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/chunks',
            params={'select': 'id', 'source_url': f'eq.{source["url"]}', 'is_stale': 'eq.false', 'limit': '1'},
            headers=headers
        )
        response.raise_for_status()
        existing = response.json()

        chunks = chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP)
        if not chunks:
            print(f"  ⚠ No chunks extracted, skipping.")
            return

        embeddings = embed_texts(chunks)
        upsert_chunks(source, chunks, embeddings)

    except Exception as e:
        print(f"  ✗ Error processing {source['url']}: {e}")


if __name__ == "__main__":
    print(f"Starting ingestion — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    for source in SOURCES:
        process_source(source)
    print("Ingestion complete.")
