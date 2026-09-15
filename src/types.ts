export interface DocumentRecord {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  pageCount: number;
  uploadedAt: string;
  textContent: string;
  analysis?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  documentType: string;
  title: string;
  parties: { party1: string; party2: string; [key: string]: string };
  effectiveDate: string;
  expirationDate: string;
  executiveSummary: string;
  standardSummary: string;
  detailedSummary: string;
  actionSummary: string;
  extractedFields: Array<{
    field: string;
    value: string;
    status: 'found' | 'not_found' | 'uncertain' | 'not_applicable';
  }>;
  clauses: ClauseItem[];
  risks: RiskFinding[];
  checklist: ChecklistItem[];
  lawyerPrep: string[];
}

export interface ClauseItem {
  id: string;
  category: 'payment' | 'termination' | 'liability' | 'ip' | 'confidentiality' | 'indemnity' | 'dispute' | 'governing_law' | 'other';
  originalText: string;
  plainExplanation: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  potentialConcern: string;
  reasoning: string;
  confidence: number;
  suggestedQuestion: string;
  suggestedNextStep: string;
}

export interface RiskFinding {
  id: string;
  clauseId: string;
  category: string;
  severity: 'informational' | 'attention' | 'significant' | 'critical';
  confidence: number;
  rationale: string;
  potentialConsequence: string;
  suggestedAction: string;
  citation: { quote: string; charStart: number; charEnd: number };
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  sourceClauseId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  unsupported?: boolean;
  evidence?: Array<{ clauseId: string; quote: string }>;
  timestamp: string;
}

export interface ApiConfig {
  geminiApiKey: string;
  dbProvider: 'supabase' | 'firebase' | 'internal';
  supabaseUrl?: string;
  supabaseKey?: string;
  firebaseProjectId?: string;
}
