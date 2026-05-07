import { describe, it, expect } from 'vitest'
import { logQuery } from '@/lib/logging'

describe('Query Logging', () => {
  describe('logQuery', () => {
    it('should create a log with all required fields', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'What is legal aid?',
        inScope: true,
        sourceCount: 2,
      })

      expect(log).toHaveProperty('timestamp')
      expect(log).toHaveProperty('ipAddress')
      expect(log).toHaveProperty('userQuery')
      expect(log).toHaveProperty('inScope')
      expect(log).toHaveProperty('sourceCount')
    })

    it('should record IP address', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Test query',
        inScope: true,
        sourceCount: 1,
      })

      expect(log.ipAddress).toBe('192.168.1.1')
    })

    it('should log rejected queries with guardrail reason', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Can you help me commit fraud?',
        inScope: false,
        guardrailReason: 'Query requests illegal activity',
        sourceCount: 0,
      })

      expect(log.inScope).toBe(false)
      expect(log.guardrailReason).toBe('Query requests illegal activity')
      expect(log.sourceCount).toBe(0)
    })

    it('should include prompt metadata when provided', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Test query',
        inScope: true,
        promptMetadata: {
          version: '1.0.0',
          timestamp: '2026-03-21T00:00:00Z',
          guardrailsVersion: '1.0.0',
        },
        sourceCount: 1,
      })

      expect(log.promptVersion).toBe('1.0.0')
      expect(log.guardrailsVersion).toBe('1.0.0')
    })

    it('should handle errors gracefully', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Test query',
        inScope: true,
        sourceCount: 1,
        error: 'Database connection failed',
      })

      expect(log.error).toBe('Database connection failed')
    })

    it('should include response metrics when provided', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Test query',
        inScope: true,
        sourceCount: 2,
        responseLength: 256,
      })

      expect(log.responseLength).toBe(256)
    })

    it('should have ISO 8601 timestamp', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Test query',
        inScope: true,
        sourceCount: 1,
      })

      const timestamp = new Date(log.timestamp)
      expect(timestamp.getTime()).toBeGreaterThan(0)
      expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should distinguish between accepted and rejected queries', () => {
      const accepted = logQuery({
        ip: '192.168.1.1',
        query: 'What is legal aid?',
        inScope: true,
        sourceCount: 2,
      })

      const rejected = logQuery({
        ip: '192.168.1.1',
        query: 'Harmful request',
        inScope: false,
        guardrailReason: 'Out of scope',
        sourceCount: 0,
      })

      expect(accepted.inScope).toBe(true)
      expect(rejected.inScope).toBe(false)
    })
  })

  describe('Audit trail compliance', () => {
    it('should never lose query content', () => {
      const query = 'Complex legal aid question with special chars: @#$%'
      const log = logQuery({
        ip: '192.168.1.1',
        query,
        inScope: true,
        sourceCount: 1,
      })

      expect(log.userQuery).toBe(query)
    })

    it('should track rejected queries for audit', () => {
      const log = logQuery({
        ip: '192.168.1.1',
        query: 'Rejected query',
        inScope: false,
        guardrailReason: 'Guardrail triggered',
        sourceCount: 0,
      })

      expect(log.inScope).toBe(false)
      expect(log.guardrailReason).toBeDefined()
    })
  })
})
