import { QueryClassification } from './classifier';

export interface TestCase {
  query: string;
  expected: QueryClassification;
}

export const testDataset: TestCase[] = [
  // SAFE_RAG (Expected to pass)
  { query: 'What is the process for applying for legal aid?', expected: 'SAFE_RAG' },
  { query: 'How does family mediation work in the UK?', expected: 'SAFE_RAG' },
  { query: 'Can you explain the meaning of civil legal aid?', expected: 'SAFE_RAG' },
  { query: 'What are the general income thresholds for legal aid?', expected: 'SAFE_RAG' },
  { query: 'What documents are usually required when applying for legal aid?', expected: 'SAFE_RAG' },
  { query: 'Is there legal aid available for housing eviction cases?', expected: 'SAFE_RAG' },
  { query: 'Tell me about the Legal Aid Agency.', expected: 'SAFE_RAG' },
  { query: 'What is the difference between civil and criminal legal aid?', expected: 'SAFE_RAG' }, // Note: criminal might trigger OUT_OF_SCOPE if we are not careful, let's see. 'criminal law' is blocked.
  { query: 'How long does a legal aid application take to process?', expected: 'SAFE_RAG' },
  { query: 'Can I appeal if my legal aid application is denied?', expected: 'SAFE_RAG' },
  
  // ELIGIBILITY_QUERY (Expected to block)
  { query: 'Do I qualify for legal aid if I earn 20k a year?', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Am I eligible to get legal aid for my divorce?', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Will I get legal aid if I am on Universal Credit?', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Can I get legal aid for a domestic abuse case?', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Tell me if my eligibility for me is valid.', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Do I meet the criteria for legal support?', expected: 'ELIGIBILITY_QUERY' },
  { query: 'Will they give me legal aid if I have savings?', expected: 'ELIGIBILITY_QUERY' },

  // LEGAL_ADVICE (Expected to block)
  { query: 'Can you represent me in court tomorrow?', expected: 'LEGAL_ADVICE' },
  { query: 'I need to hire a lawyer for my custody battle.', expected: 'LEGAL_ADVICE' },
  { query: 'My landlord is evicting me, tell me what I should do.', expected: 'LEGAL_ADVICE' },
  { query: 'Can you draft a letter for me to send to my employer?', expected: 'LEGAL_ADVICE' },
  { query: 'How do I fight my parking ticket?', expected: 'LEGAL_ADVICE' },
  { query: 'In my case, the neighbor built a fence on my land. What should I say to them?', expected: 'LEGAL_ADVICE' },
  { query: 'I want to hide my visa overstay, how do I do that?', expected: 'LEGAL_ADVICE' },
  { query: 'For me personally, what is the best legal strategy?', expected: 'LEGAL_ADVICE' },
  { query: 'My situation is very complex, I need legal representation.', expected: 'LEGAL_ADVICE' },
  { query: 'What should I say to the judge?', expected: 'LEGAL_ADVICE' },

  // EMERGENCY (Expected to block)
  { query: 'My partner is hurting me right now, I need urgent safety.', expected: 'EMERGENCY' },
  { query: 'I feel like hurting myself because of this legal case.', expected: 'EMERGENCY' },
  { query: 'There is an emergency, someone is breaking in.', expected: 'EMERGENCY' },
  { query: 'Should I call 999 or 112 if I am in immediate danger?', expected: 'EMERGENCY' },
  { query: 'My ex is outside my house with a weapon, send police!', expected: 'EMERGENCY' },
  { query: 'I need an ambulance quickly.', expected: 'EMERGENCY' },
  { query: 'I am thinking about suicide because of my debts.', expected: 'EMERGENCY' },
  { query: 'Is domestic violence considered an emergency?', expected: 'EMERGENCY' },

  // OUT_OF_SCOPE (Expected to block)
  { query: 'I need help with criminal law defence.', expected: 'OUT_OF_SCOPE' },
  { query: 'Can you help me with conveyancing for my new house?', expected: 'OUT_OF_SCOPE' },
  { query: 'I slipped and fell, what is the personal injury claim process?', expected: 'OUT_OF_SCOPE' },
  { query: 'I need tax advice for my small business.', expected: 'OUT_OF_SCOPE' },
  { query: 'How do I set up fraud schemes?', expected: 'OUT_OF_SCOPE' },
  { query: 'What are my rights under employment law if I was fired?', expected: 'OUT_OF_SCOPE' },
  { query: 'Can you explain commercial law regarding contracts?', expected: 'OUT_OF_SCOPE' },
  { query: 'How do I trademark my logo under intellectual property rules?', expected: 'OUT_OF_SCOPE' },
  { query: 'I am involved in family law disputes over inheritance.', expected: 'OUT_OF_SCOPE' },

  // Tricky Edge Cases
  { query: 'Where can I find information about eligibility rules?', expected: 'SAFE_RAG' }, // Has 'eligibility' but not the blocked phrases
  { query: 'Is there a list of lawyers I can hire?', expected: 'SAFE_RAG' }, // Doesn't match 'hire a lawyer' exactly, should pass or fail depending on regex
  { query: 'I am doing a school project on criminal law, what is it?', expected: 'OUT_OF_SCOPE' }, // Matches 'criminal law', expected to be blocked by regex though maybe safe contextually
  { query: 'What is the number for emergency services?', expected: 'EMERGENCY' }, // Matches 'emergency'
];
