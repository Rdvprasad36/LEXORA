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

export async function analyzeLegalDocument(payload: AnalyzeRequest): Promise<LegalAnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze legal document.');
  }
  return data.analysis as LegalAnalysisResult;
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
