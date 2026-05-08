import { Chunk, StaleSourceError } from './retrieve'
import { getCurrentPromptVersion } from '@/lib/prompts'
import { logPromptGeneration } from '@/lib/logging'

export interface PromptResult {
  systemPrompt: string
  promptVersion: string
  sourceCount: number
  hasStaleChunks: boolean
  contextQuality: 'high' | 'medium' | 'low'
}

export function buildPrompt(chunks: Chunk[]): PromptResult {
  const promptVersion = getCurrentPromptVersion()

  // Filter out stale sources, but if no fresh sources, use stale ones
  let validChunks = chunks.filter(chunk => !chunk.is_stale)
  const hasStaleChunks = validChunks.length === 0 && chunks.length > 0
  
  if (validChunks.length === 0) {
    validChunks = chunks // Use stale sources if no fresh ones
  }

  // If still no sources, throw error
  if (validChunks.length === 0) {
    throw new StaleSourceError('I cannot provide an answer as there are no verified official sources covering this topic.')
  }

  // Calculate context quality based on similarity scores and staleness
  const avgSimilarity = validChunks.reduce((sum, c) => sum + c.similarity, 0) / validChunks.length
  let contextQuality: 'high' | 'medium' | 'low' = 'low'
  
  if (hasStaleChunks) {
    contextQuality = 'low'
  } else if (avgSimilarity >= 0.85 && validChunks.length >= 3) {
    contextQuality = 'high'
  } else if (avgSimilarity >= 0.75 || validChunks.length >= 2) {
    contextQuality = 'medium'
  } else {
    contextQuality = 'low'
  }

  const context = validChunks
    .map(
      (c, i) =>
        `[${i + 1}] SOURCE: ${c.source_title} (${c.source_url}) [Relevance: ${(c.similarity * 100).toFixed(0)}%${c.is_stale ? ', STALE' : ''}]\n${c.content}`
    )
    .join('\n\n---\n\n')

  const systemPrompt = promptVersion.systemPrompt.replace('{CONTEXT}', context)

  // Log for audit trail
  logPromptGeneration({
    promptVersion: promptVersion.version,
    sourceCount: validChunks.length,
    contextLength: context.length,
    totalLength: systemPrompt.length,
  })

  return {
    systemPrompt,
    promptVersion: promptVersion.version,
    sourceCount: validChunks.length,
    hasStaleChunks,
    contextQuality,
  }
}
