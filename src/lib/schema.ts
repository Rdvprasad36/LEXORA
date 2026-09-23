/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LegalFinding {
  id: string;
  category: 'Risk' | 'Obligation' | 'Right' | 'Inconsistency' | 'Definition';
  title: string;
  summary: string;
  severity: 'High' | 'Medium' | 'Low' | 'Critical';
  confidence: 'High' | 'Medium' | 'Low';
  exactQuote: string; // The exact quote expected in the document
  explanation: string;
  whyItMatters: string;
  simplifiedVersion: string;
  suggestedAction: string;
  evidenceStatus?: 'verified' | 'unverified' | 'partially_verified';
  matchScore?: number;
  matchedText?: string;
}

export interface LegalAnalysisResult {
  documentTitle: string;
  documentType: string;
  overallRiskScore: number; // 0 to 100
  executiveSummary: string;
  targetRole: string;
  targetConcern: string;
  findings: LegalFinding[];
  keyObligations: {
    obligation: string;
    deadlineOrCondition: string;
    responsibleParty: string;
    exactQuote: string;
  }[];
  questionsForProfessional: string[];
  optionsAndNextSteps: string[];
}
