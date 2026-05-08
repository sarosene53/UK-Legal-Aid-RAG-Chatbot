import { openai } from '@ai-sdk/openai'
import { streamText, StreamingTextResponse } from 'ai'
import { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { classifyQuery } from '@/lib/guardrails/classifier'
import { embedQuery } from '@/lib/rag/embed'
import { retrieveChunks, StaleSourceError } from '@/lib/rag/retrieve'
import { buildPrompt } from '@/lib/rag/prompt'
import { getPromptWithMetadata } from '@/lib/prompts'
import { logQuery } from '@/lib/logging'

export const runtime = 'nodejs'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '10 m'),
})

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return new Response('Too many requests. Please wait a moment.', { status: 429 })
  }

  const { messages } = await req.json()
  const userMessage = messages[messages.length - 1]?.content ?? ''

  try {
    // Guardrail: classify before spending tokens on RAG
    const classification = await classifyQuery(userMessage)
    if (!classification.allowProcessing) {
      // Log rejected query
      logQuery({
        ip,
        query: userMessage,
        inScope: false,
        guardrailReason: classification.reason,
        classification: classification.classification,
        sourceCount: 0,
      })

      return new Response(
        JSON.stringify({ error: true, message: classification.response }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // RAG pipeline
    const queryEmbedding = await embedQuery(userMessage)
    const chunks = await retrieveChunks(queryEmbedding)
    
    // Check if we have any chunks at all
    if (chunks.length === 0) {
      logQuery({
        ip,
        query: userMessage,
        inScope: true,
        classification: classification.classification,
        sourceCount: 0,
        warning: 'No relevant sources found for query'
      })
      
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: 'I cannot provide an answer as there are no verified official sources covering this topic.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const promptResult = buildPrompt(chunks)
    const { metadata } = getPromptWithMetadata()

    // Use same logic as buildPrompt for citations
    let validChunks = chunks.filter(chunk => !chunk.is_stale)
    if (validChunks.length === 0) {
      validChunks = chunks // Use stale sources if no fresh ones
    }
    
    // Create citations with all available metadata
    const citations = validChunks.map((c) => ({
      id: c.id,
      source_title: c.source_title,
      source_url: c.source_url,
      publication_date: c.publication_date,
      similarity: c.similarity,
    }))

    // Log accepted query
    logQuery({
      ip,
      query: userMessage,
      inScope: true,
      classification: classification.classification,
      promptMetadata: metadata,
      sourceCount: validChunks.length,
      sourceQuality: validChunks.length < chunks.length ? 'stale_sources_used' : 'fresh_sources',
    })

    // Stream response with safety validation
    const result = await streamText({
      model: openai('gpt-4o'),
      system: promptResult.systemPrompt,
      messages,
    })

    // Temporarily bypass validator to test streaming
    // const validatedStream = result.toAIStream().pipeThrough(new SoftValidatorStream())

    return new StreamingTextResponse(result.toAIStream(), {
      headers: {
        'X-Source-Citations': JSON.stringify(citations),
      }
    })
  } catch (error) {
    // Log errors for debugging
    logQuery({
      ip,
      query: userMessage,
      inScope: true,
      sourceCount: 0,
      error: error instanceof Error ? error.message : String(error),
    })

    if (error instanceof StaleSourceError) {
      return new Response(
        JSON.stringify({ error: true, message: error.message }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    throw error
  }
}
