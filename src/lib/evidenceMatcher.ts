/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalFinding, LegalAnalysisResult } from './schema';

export interface VerificationResult {
  verifiedFindings: LegalFinding[];
  verifiedCount: number;
  unverifiedCount: number;
  partiallyVerifiedCount: number;
}

/**
 * Normalizes text for robust matching (lowercase, strip extra whitespace, punctuation normalization)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-') // normalize hyphens/dashes
    .replace(/[\u2018\u2019]/g, "'") // normalize smart single quotes
    .replace(/[\u201c\u201d]/g, '"') // normalize smart double quotes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Levenshtein distance or substring fuzzy containment score
 */
function substringSimilarity(sub: string, full: string): number {
  const normSub = normalizeText(sub);
  const normFull = normalizeText(full);

  if (!normSub || !normFull) return 0;
  if (normFull.includes(normSub)) return 1.0;

  // Check word overlap ratio (Jaccard similarity on tokens)
  const subWords = new Set(normSub.split(' ').filter(w => w.length > 2));
  const fullWords = new Set(normFull.split(' ').filter(w => w.length > 2));

  if (subWords.size === 0) return 0;

  let intersection = 0;
  for (const word of subWords) {
    if (fullWords.has(word)) {
      intersection++;
    }
  }

  const ratio = intersection / subWords.size;
  return ratio;
}

/**
 * Verifies AI-generated claims against the raw extracted document text deterministically.
 */
export function verifyEvidence(analysis: LegalAnalysisResult, documentText: string): VerificationResult {
  let verifiedCount = 0;
  let unverifiedCount = 0;
  let partiallyVerifiedCount = 0;

  const verifiedFindings = analysis.findings.map(finding => {
    const quote = finding.exactQuote || '';
    if (!quote || quote.length < 5) {
      unverifiedCount++;
      return {
        ...finding,
        evidenceStatus: 'unverified' as const,
        matchScore: 0,
      };
    }

    const similarity = substringSimilarity(quote, documentText);

    let status: 'verified' | 'unverified' | 'partially_verified' = 'unverified';
    if (similarity >= 0.85 || normalizeText(documentText).includes(normalizeText(quote))) {
      status = 'verified';
      verifiedCount++;
    } else if (similarity >= 0.45) {
      status = 'partially_verified';
      partiallyVerifiedCount++;
    } else {
      status = 'unverified';
      unverifiedCount++;
    }

    return {
      ...finding,
      evidenceStatus: status,
      matchScore: Math.round(similarity * 100),
    };
  });

  return {
    verifiedFindings,
    verifiedCount,
    unverifiedCount,
    partiallyVerifiedCount,
  };
}
