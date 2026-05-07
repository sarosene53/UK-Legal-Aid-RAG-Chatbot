import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Chunk {
  id: string
  content: string
  source_url: string
  source_title: string
  publication_date: string
  is_stale: boolean
  similarity: number
}

export class StaleSourceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StaleSourceError'
  }
}

export async function retrieveChunks(
  embedding: number[],
  matchCount = 6
): Promise<Chunk[]> {
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: embedding,
    match_count: matchCount,
  })

  if (error) {
    console.error('Retrieval error:', error)
    return []
  }

  const chunks = data as Chunk[]

  return chunks
}
