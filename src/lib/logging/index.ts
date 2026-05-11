export interface PromptMetadata {
  version: string
  timestamp: string
  guardrailsVersion: string
}

export interface QueryLog {
  timestamp: string
  ipAddress: string
  userQuery: string
  inScope: boolean
  classification?: string
  guardrailReason?: string
  promptVersion?: string
  guardrailsVersion?: string
  sourceCount: number
  responseLength?: number
  totalTokensEstimate?: number
  error?: string
  warning?: string
  sourceQuality?: string
}


export function logQuery(params: {
  ip: string
  query: string
  inScope: boolean
  classification?: string
  guardrailReason?: string
  promptMetadata?: PromptMetadata
  sourceCount: number
  responseLength?: number
  error?: string
  warning?: string
  sourceQuality?: string
}): QueryLog {
  const log: QueryLog = {
    timestamp: new Date().toISOString(),
    ipAddress: params.ip,
    userQuery: params.query,
    inScope: params.inScope,
    classification: params.classification,
    guardrailReason: params.guardrailReason,
    promptVersion: params.promptMetadata?.version,
    guardrailsVersion: params.promptMetadata?.guardrailsVersion,
    sourceCount: params.sourceCount,
    responseLength: params.responseLength,
    error: params.error,
    warning: params.warning,
    sourceQuality: params.sourceQuality,
  }

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[QUERY_LOG]', JSON.stringify(log, null, 2))
  }


  return log
}


export function logPromptGeneration(params: {
  promptVersion: string
  sourceCount: number
  contextLength: number
  totalLength: number
}): void {
  const log = {
    timestamp: new Date().toISOString(),
    event: 'PROMPT_GENERATED',
    ...params,
  }

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[AUDIT_LOG]', JSON.stringify(log, null, 2))
  }

}
