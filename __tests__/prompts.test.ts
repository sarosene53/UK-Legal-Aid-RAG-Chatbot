import { describe, it, expect } from 'vitest'
import { getCurrentPromptVersion, getPromptVersion, getAllPromptVersions } from '@/lib/prompts'

describe('Prompt Versioning', () => {
  describe('getCurrentPromptVersion', () => {
    it('should return the current prompt version', () => {
      const version = getCurrentPromptVersion()
      expect(version).toBeDefined()
      expect(version.version).toBe('1.0.1')
      expect(version.systemPrompt).toContain('information assistant for UK legal aid')
    })

    it('should have required metadata fields', () => {
      const version = getCurrentPromptVersion()
      expect(version.date).toBeDefined()
      expect(version.description).toBeDefined()
      expect(version.guardrailsVersion).toBeDefined()
      expect(version.changes).toBeInstanceOf(Array)
      expect(version.changes.length).toBeGreaterThan(0)
    })

    it('current prompt should contain placeholder for context', () => {
      const version = getCurrentPromptVersion()
      expect(version.systemPrompt).toContain('{CONTEXT}')
    })
  })

  describe('getPromptVersion', () => {
    it('should retrieve a specific prompt version', () => {
      const version = getPromptVersion('1.0.0')
      expect(version.version).toBe('1.0.0')
    })

    it('should throw for non-existent version', () => {
      expect(() => getPromptVersion('99.0.0')).toThrow()
    })
  })

  describe('getAllPromptVersions', () => {
    it('should return all available versions', () => {
      const versions = getAllPromptVersions()
      expect(versions).toBeInstanceOf(Array)
      expect(versions.length).toBeGreaterThan(0)
    })

    it('should include current version', () => {
      const versions = getAllPromptVersions()
      const current = getCurrentPromptVersion()
      const found = versions.find((v: any) => v.version === current.version)
      expect(found).toBeDefined()
    })
  })

  describe('Prompt guardrails', () => {
    it('should enforce citation format requirement', () => {
      const version = getCurrentPromptVersion()
      expect(version.systemPrompt).toContain('* [Title] (URL)')
    })

    it('should prohibit outside knowledge', () => {
      const version = getCurrentPromptVersion()
      expect(version.systemPrompt.toLowerCase()).toContain('only')
      expect(version.systemPrompt.toLowerCase()).toContain('sources')
    })

    it('should specify case-specific advice prohibition', () => {
      const version = getCurrentPromptVersion()
      expect(version.systemPrompt.toLowerCase()).toContain('no personalised advice')
    })

    it('should mandate plain reading language', () => {
      const version = getCurrentPromptVersion()
      expect(version.systemPrompt.toLowerCase()).toContain('clearly')
      expect(version.systemPrompt.toLowerCase()).toContain('focused')
    })
  })
})
