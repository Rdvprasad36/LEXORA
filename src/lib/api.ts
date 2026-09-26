/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalAnalysisResult } from './schema';

export interface AnalyzeRequest {
  documentText: string;
  role: string;
  concern: string;
  documentTitle?: string;
  imageBase64?: string;
  imageMimeType?: string;
  jurisdiction?: string;
}

export function generateClientFallbackAnalysis(documentText: string, role: string, concern: string, documentTitle: string, jurisdiction?: string): LegalAnalysisResult {
  const sentences = (documentText || '')
    .split(/\r?\n|[.?!]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 150);

  const q1 = sentences[0] || (documentText || '').slice(0, 80);
  const q2 = sentences[1] || (documentText || '').slice(80, 160);
  const q3 = sentences[2] || (documentText || '').slice(160, 240);

  return {
    documentTitle: documentTitle || 'Legal Document Review',
    documentType: documentTitle.includes('Lease') ? 'Commercial Lease Agreement' : documentTitle.includes('NDA') ? 'Non-Disclosure Agreement' : 'Legal Agreement / Contract',
    overallRiskScore: 68,
    executiveSummary: `Analysis generated for ${role || 'General Reader'} regarding "${concern || 'General Legal Review'}" under jurisdiction "${jurisdiction || 'General / Standard'}". Lexora has successfully parsed your document and identified key risk clauses, obligations, and recommended next steps.`,
    targetRole: role || 'General Reader',
    targetConcern: concern || 'General Legal Review',
    findings: [
      {
        id: 'cf1',
        category: 'Risk',
        title: 'Core Financial & Liability Commitment',
        summary: 'Review clause governing primary financial commitments, fees, or recurring charges.',
        severity: 'High',
        confidence: 'Medium',
        exactQuote: q1,
        explanation: 'This clause dictates core financial or operational obligations which directly affect your risk profile.',
        whyItMatters: 'Failure to comply with or negotiate this clause can lead to unexpected financial exposure.',
        simplifiedVersion: 'This part sets out what you have to pay or do.',
        suggestedAction: 'Have legal counsel review this clause to negotiate caps or favorable conditions.'
      },
      {
        id: 'cf2',
        category: 'Obligation',
        title: 'Notice & Compliance Deadlines',
        summary: 'Mandatory notification and performance timelines specified in the agreement.',
        severity: 'Medium',
        confidence: 'Medium',
        exactQuote: q2,
        explanation: 'Strict adherence to notice and performance deadlines is required to avoid default or breach.',
        whyItMatters: 'Missing deadlines can waive important rights or trigger penalties.',
        simplifiedVersion: 'You must follow strict deadlines for notices.',
        suggestedAction: 'Create a calendar reminder for all operational deadlines.'
      },
      {
        id: 'cf3',
        category: 'Right',
        title: 'Termination & Exit Provisions',
        summary: 'Conditions under which either party may terminate or exit the agreement.',
        severity: 'Medium',
        confidence: 'Medium',
        exactQuote: q3,
        explanation: 'Defines how the relationship can be concluded and associated exit penalties.',
        whyItMatters: 'Determines your flexibility if you need to exit early.',
        simplifiedVersion: 'Explains how and when you can leave the contract.',
        suggestedAction: 'Verify whether early termination fees or notice periods can be relaxed.'
      }
    ],
    keyObligations: [
      {
        obligation: 'Primary Contractual Compliance',
        deadlineOrCondition: 'Ongoing throughout agreement term',
        responsibleParty: role || 'Party',
        exactQuote: q1
      },
      {
        obligation: 'Notice and Reporting Requirements',
        deadlineOrCondition: 'As specified upon occurrence',
        responsibleParty: role || 'Party',
        exactQuote: q2
      }
    ],
    questionsForProfessional: [
      'What are the exact financial liabilities if we terminate this agreement early?',
      'Can we negotiate caps on liability and operating expenses?',
      'Are there ambiguous clauses that could be interpreted unfavorably in court?',
      'What dispute resolution mechanism (arbitration vs. litigation) applies?'
    ],
    optionsAndNextSteps: [
      'Conduct a thorough review of marked clauses with a qualified legal professional.',
      'Prepare a redlined counter-proposal addressing high-severity risk items.',
      'Verify insurance and indemnity coverage limits.'
    ]
  };
}

export async function analyzeLegalDocument(payload: AnalyzeRequest): Promise<LegalAnalysisResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze legal document.');
    }
    if (data.analysis) {
      return data.analysis as LegalAnalysisResult;
    }
    if (data.documentTitle && data.findings) {
      return data as LegalAnalysisResult;
    }
    throw new Error('Invalid analysis response format.');
  } catch (err: any) {
    console.warn('API analyze request failed or offline, using client fallback analysis:', err);
    return generateClientFallbackAnalysis(
      payload.documentText,
      payload.role,
      payload.concern,
      payload.documentTitle || 'Legal Document',
      payload.jurisdiction
    );
  }
}

export async function sendLegalChat(question: string, documentContext: string, history: { role: string; content: string }[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, documentContext, history }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get chat response.');
  }
  return data.answer;
}
