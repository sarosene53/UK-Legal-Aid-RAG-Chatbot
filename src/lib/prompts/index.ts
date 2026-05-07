import versions from './versions.json'

export interface PromptVersion {
  version: string
  date: string
  description: string
  guardrailsVersion: string
  changes: string[]
  systemPrompt: string
}

export interface PromptMetadata {
  version: string
  timestamp: string
  guardrailsVersion: string
}

// Get current prompt version
export function getCurrentPromptVersion(): PromptVersion {
  const currentVer = versions.current
  const versionData = versions.versions.find(v => v.version === currentVer)
  
  if (!versionData) {
    throw new Error(`Prompt version ${currentVer} not found`)
  }
  
  return versionData
}

// Get specific prompt version
export function getPromptVersion(versionId: string): PromptVersion {
  const versionData = versions.versions.find(v => v.version === versionId)
  
  if (!versionData) {
    throw new Error(`Prompt version ${versionId} not found`)
  }
  
  return versionData
}

// Get all versions (for debugging/admin)
export function getAllPromptVersions(): PromptVersion[] {
  return versions.versions
}

// Get current prompt with metadata
export function getPromptWithMetadata(): {
  prompt: PromptVersion
  metadata: PromptMetadata
} {
  const prompt = getCurrentPromptVersion()
  const metadata: PromptMetadata = {
    version: prompt.version,
    timestamp: new Date().toISOString(),
    guardrailsVersion: prompt.guardrailsVersion,
  }
  
  return { prompt, metadata }
}
