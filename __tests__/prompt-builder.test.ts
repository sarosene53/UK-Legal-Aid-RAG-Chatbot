import { describe, it, expect, vi } from 'vitest'
import { buildPrompt } from '@/lib/rag/prompt'

// Mock the retrieve module to avoid Supabase client creation
vi.mock('@/lib/rag/retrieve', () => ({
  StaleSourceError: class StaleSourceError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'StaleSourceError'
    }
  }
}))

// Mock Chunk data
const mockChunks = [
  {
    id: '1',
    content: 'Legal aid helps eligible people pay for legal representation.',
    source_title: 'gov.uk - Legal Aid Overview',
    source_url: 'https://www.gov.uk/legal-aid',
    publication_date: '2025-01-15',
    is_stale: false,
    similarity: 0.92,
  },
  {
    id: '2',
    content: 'You may be eligible if you earn less than £2,657 per month.',
    source_title: 'gov.uk - Legal Aid Eligibility',
    source_url: 'https://www.gov.uk/legal-aid/eligibility',
    publication_date: '2025-02-20',
    is_stale: false,
    similarity: 0.88,
  },
]

describe('Prompt Building', () => {
  describe('buildPrompt', () => {
    it('should return a PromptResult with required fields', () => {
      const result = buildPrompt(mockChunks)
      expect(result).toHaveProperty('systemPrompt')
      expect(result).toHaveProperty('promptVersion')
      expect(result).toHaveProperty('sourceCount')
    })

    it('should include all source chunks in context', () => {
      const result = buildPrompt(mockChunks)
      expect(result.systemPrompt).toContain('Legal aid helps eligible people')
      expect(result.systemPrompt).toContain('You may be eligible if you earn')
    })

    it('should format source citations correctly', () => {
      const result = buildPrompt(mockChunks)
      expect(result.systemPrompt).toContain('[1] SOURCE: gov.uk - Legal Aid Overview')
      expect(result.systemPrompt).toContain('gov.uk - Legal Aid Eligibility')
    })

    it('should include source URLs', () => {
      const result = buildPrompt(mockChunks)
      expect(result.systemPrompt).toContain('https://www.gov.uk/legal-aid')
      expect(result.systemPrompt).toContain('https://www.gov.uk/legal-aid/eligibility')
    })

    it('should report correct source count', () => {
      const result = buildPrompt(mockChunks)
      expect(result.sourceCount).toBe(2)
    })

    it('should set promptVersion', () => {
      const result = buildPrompt(mockChunks)
      expect(result.promptVersion).toBe('1.0.1')
    })

    it('should handle empty chunks', () => {
      expect(() => buildPrompt([])).toThrow('I cannot provide an answer as there are no verified official sources covering this topic.')
    })

    it('should filter out stale chunks', () => {
      const staleChunks = [
        { ...mockChunks[0], is_stale: true },
        { ...mockChunks[1], is_stale: true },
      ]
      const result = buildPrompt(staleChunks)
      expect(result.sourceCount).toBe(2) // Should use stale sources if no fresh ones
      expect(result.systemPrompt).toContain('Legal aid helps eligible people')
    })

    it('should use only non-stale chunks when available', () => {
      const mixedChunks = [
        mockChunks[0], // not stale
        { ...mockChunks[1], is_stale: true },
      ]
      const result = buildPrompt(mixedChunks)
      expect(result.sourceCount).toBe(1)
      expect(result.systemPrompt).toContain('Legal aid helps eligible people')
      expect(result.systemPrompt).not.toContain('You may be eligible if you earn')
    })

    it('should include guardrail rules in system prompt', () => {
      const result = buildPrompt(mockChunks)
      const prompt = result.systemPrompt
      
      expect(prompt).toContain('Use ONLY the provided retrieved sources')
      expect(prompt).toContain('Explain laws, rules, procedures, and benefits clearly')
      expect(prompt).toContain('* [Title] (URL)')
      expect(prompt).toContain('Do NOT give case-specific recommendations')
      expect(prompt).toContain('Direct answer:')
    })

    it('should separate sources with dividers', () => {
      const result = buildPrompt(mockChunks)
      // Check for source divider
      expect(result.systemPrompt).toContain('---')
    })
  })

  describe('Prompt compliance', () => {
    it('should maintain fallback response template', () => {
      const result = buildPrompt(mockChunks)
      expect(result.systemPrompt).toContain('I cannot provide an answer as there are no verified official sources covering this topic.')
    })

    it('should emphasize general information only', () => {
      const result = buildPrompt(mockChunks)
      expect(result.systemPrompt).toContain('Explain laws, rules, procedures, and benefits clearly')
    })
  })
})
