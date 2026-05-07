import { Chunk, StaleSourceError } from './retrieve'
import { getCurrentPromptVersion } from '@/lib/prompts'
import { logPromptGeneration } from '@/lib/logging'

export interface PromptResult {
  systemPrompt: string
  promptVersion: string
  sourceCount: number
}

export function buildPrompt(chunks: Chunk[]): PromptResult {
  const promptVersion = getCurrentPromptVersion()

  // Filter out stale sources, but if no fresh sources, use stale ones
  let validChunks = chunks.filter(chunk => !chunk.is_stale)
  if (validChunks.length === 0) {
    validChunks = chunks // Use stale sources if no fresh ones
  }

  // If still no sources, throw error
  if (validChunks.length === 0) {
    throw new StaleSourceError('I cannot provide an answer as there are no verified official sources covering this topic.')
  }

  const context = validChunks
    .map(
      (c, i) =>
        `[${i + 1}] SOURCE: ${c.source_title} (${c.source_url})\n${c.content}`
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
  }
}
