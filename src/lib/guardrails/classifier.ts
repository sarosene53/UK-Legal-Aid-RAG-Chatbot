export type QueryClassification =
  | 'SAFE_RAG'
  | 'ELIGIBILITY_QUERY'
  | 'LEGAL_ADVICE'
  | 'EMERGENCY'
  | 'OUT_OF_SCOPE'

export interface ClassificationResult {
  classification: QueryClassification
  allowProcessing: boolean
  response?: string
  reason?: string
}

export const OUT_OF_SCOPE_TOPICS = [
  'criminal law', 'conveyancing', 'personal injury', 'tax advice', 'fraud schemes',
  'employment law', 'commercial law', 'intellectual property', 'family law disputes'
]

export const EMERGENCY_KEYWORDS = [
  'suicide', 'self-harm', 'hurting myself', 'emergency', 'immediate danger',
  'domestic violence', 'urgent safety', '999', '112', 'ambulance', 'police'
]

export const ADVICE_KEYWORDS = [
  'represent me', 'hire a lawyer', 'find an attorney', 'legal representation',
  'specific case', 'tell me what i should do', 'draft a letter for me',
  'commit fraud', 'hide visa overstay', 'how do i fight', 'what should i say',
  'my situation is', 'in my case', 'for me personally'
]

export const ELIGIBILITY_KEYWORDS = [
  'do i qualify', 'am i eligible', 'will i get legal aid', 'can i get legal aid',
  'eligibility for me', 'do i meet the criteria', 'will they give me legal aid'
]

export async function classifyQuery(query: string): Promise<ClassificationResult> {
  const lower = query.toLowerCase()

  // EMERGENCY: Block immediately and redirect to emergency services
  if (EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword))) {
    return {
      classification: 'EMERGENCY',
      allowProcessing: false,
      response: 'If you are in immediate danger or feeling suicidal, call 999 (UK) or your local emergency services right away. For mental health support, contact Samaritans at 116 123 or samaritans.org.',
      reason: 'Emergency situation detected'
    }
  }

  // ELIGIBILITY_QUERY: Block and redirect to official checker
  if (ELIGIBILITY_KEYWORDS.some(keyword => lower.includes(keyword))) {
    return {
      classification: 'ELIGIBILITY_QUERY',
      allowProcessing: false,
      response: 'I cannot determine if you qualify for legal aid. To check your eligibility definitively, please use the official GOV.UK checker at https://www.gov.uk/check-legal-aid or consult a legal professional.',
      reason: 'Eligibility determination query'
    }
  }

  // LEGAL_ADVICE: Block and redirect to professional help
  if (ADVICE_KEYWORDS.some(keyword => lower.includes(keyword))) {
    return {
      classification: 'LEGAL_ADVICE',
      allowProcessing: false,
      response: 'I can only provide general legal information, not tailored advice or representation for your specific situation. Please consult a qualified solicitor or legal adviser.',
      reason: 'Personalized legal advice request'
    }
  }

  // OUT_OF_SCOPE: Block topics outside civil legal aid scope
  if (OUT_OF_SCOPE_TOPICS.some(topic => lower.includes(topic))) {
    return {
      classification: 'OUT_OF_SCOPE',
      allowProcessing: false,
      response: 'This tool covers civil legal aid matters only. The topic you asked about is outside what I can help with. For other legal matters, please consult appropriate legal professionals.',
      reason: 'Topic outside civil legal aid scope'
    }
  }

  // SAFE_RAG: Allow processing for general legal information queries
  return {
    classification: 'SAFE_RAG',
    allowProcessing: true,
    reason: 'Safe query for general legal information'
  }
}
