-- Enable pgvector extension
create extension if not exists vector;

-- Documents table
create table documents (
  id               uuid primary key default gen_random_uuid(),
  source_url       text not null unique,
  source_title     text,
  publication_date date,
  last_checked_at  timestamp with time zone default now(),
  content_hash     text,
  is_retired       boolean default false
);

-- Knowledge base chunks table
create table chunks (
  id                uuid primary key default gen_random_uuid(),
  document_id       uuid references documents(id) on delete cascade,
  chunk_index       int not null,
  content           text not null,
  embedding         vector(1536),          -- text-embedding-3-small dimensions
  source_url        text not null,
  source_title      text,
  section           text,
  publication_date  date,
  last_checked_at   timestamp with time zone default now(),
  is_stale          boolean default false,
  version           int default 1
);

-- HNSW index for fast approximate nearest-neighbour search
create index on chunks using hnsw (embedding vector_cosine_ops);

-- B-tree indexes for filter fields
create index on chunks (is_stale);
create index on chunks (source_url);
create index on chunks (document_id);

-- Retrieval function: returns top-k non-stale chunks by cosine similarity
create or replace function match_chunks(
  query_embedding vector(1536),
  match_count     int default 8
)
returns table (
  id            uuid,
  content       text,
  source_url    text,
  source_title  text,
  publication_date date,
  is_stale      boolean,
  similarity    float
)
language sql stable
as $$
  select
    id,
    content,
    source_url,
    source_title,
    publication_date,
    is_stale,
    1 - (embedding <=> query_embedding) as similarity
  from chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;
