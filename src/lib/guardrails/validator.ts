export class SoftValidatorStream extends TransformStream<Uint8Array, Uint8Array> {
  private buffer = ''
  private sourcesSectionFound = false

  constructor() {
    super({
      transform: (chunk, controller) => {
        // Convert Uint8Array to string
        const chunkStr = new TextDecoder().decode(chunk)
        this.buffer += chunkStr

        // Process complete sentences/thought units
        let splitIndex = -1
        do {
          splitIndex = this.buffer.search(/([.?!]\s*|\n\s*\n)/)

          if (splitIndex !== -1) {
            const match = this.buffer.match(/([.?!]\s*|\n\s*\n)/)!
            const endIndex = splitIndex + match[0].length
            let sentence = this.buffer.substring(0, endIndex)

            sentence = this.applySafetyRewrites(sentence)
            sentence = this.ensureSourcesSection(sentence)

            // Convert back to Uint8Array and enqueue
            controller.enqueue(new TextEncoder().encode(sentence))
            this.buffer = this.buffer.substring(endIndex)
          }
        } while (splitIndex !== -1)
      },
      flush: (controller) => {
        if (this.buffer.length > 0) {
          let finalChunk = this.applySafetyRewrites(this.buffer)
          finalChunk = this.ensureSourcesSection(finalChunk)
          controller.enqueue(new TextEncoder().encode(finalChunk))
        }

        // Ensure sources section exists if not already present
        if (!this.sourcesSectionFound) {
          controller.enqueue(new TextEncoder().encode('\n\nSources:\n* No specific source cited. Please verify with official GOV.UK guidance.'))
        }
      }
    })
  }

  private applySafetyRewrites(text: string): string {
    // Track if we've seen sources section
    if (text.toLowerCase().includes('sources:') || text.toLowerCase().includes('sources\n')) {
      this.sourcesSectionFound = true
    }

    let modified = text

    // Eligibility statements - replace with neutral language
    modified = modified.replace(/\b(you (qualify|are eligible|will get|can get) legal aid)\b/gi, 'eligibility is subject to official assessment')
    modified = modified.replace(/\b(you (qualify|are eligible) for)\b/gi, 'eligibility for')
    modified = modified.replace(/\b(you will likely|you probably|you should)\b/gi, 'individuals typically')

    // Personalized advice language - neutralize
    modified = modified.replace(/\b(you should|i advise you to|my recommendation is|i recommend|you must)\b/gi, 'individuals typically')
    modified = modified.replace(/\b(in your case|for you specifically|you need to)\b/gi, 'in general')
    modified = modified.replace(/\b(your situation|your circumstances)\b/gi, 'such situations')

    // Remove definitive statements about outcomes
    modified = modified.replace(/\b(will be granted|will receive|will qualify)\b/gi, 'may be eligible for')
    modified = modified.replace(/\b(will not qualify|will be denied|cannot get)\b/gi, 'may not be eligible for')

    // Ensure neutral, informational tone
    modified = modified.replace(/\b(i suggest|here's what to do|the best approach)\b/gi, 'one approach')

    return modified
  }

  private ensureSourcesSection(text: string): string {
    // If this chunk contains sources, mark as found
    if (text.toLowerCase().includes('sources:')) {
      this.sourcesSectionFound = true
    }

    return text
  }
}
