"""
chunker.py — Simple word-based text chunker with overlap.

For production, replace with a token-aware chunker using tiktoken.
"""


def chunk_text(text: str, chunk_size: int = 512, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks by approximate word count.
    chunk_size: target words per chunk
    overlap: words to repeat between consecutive chunks
    """
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunk = chunk.strip()
        if len(chunk) > 50:  # skip tiny fragments
            chunks.append(chunk)
        start += chunk_size - overlap

    return chunks
