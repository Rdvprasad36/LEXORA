/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { verifyEvidence } from '../evidenceMatcher';
import { LegalAnalysisResult } from '../schema';

describe('evidenceMatcher', () => {
  const sampleDocument = `
    This Commercial Lease Agreement (the "Agreement") is entered into as of January 1, 2026.
    Tenant shall pay a monthly rent of $5,000 on the first day of each calendar month.
    Security deposit of $10,000 is due upon signing.
    Tenant shall maintain commercial general liability insurance with a minimum limit of $1,000,000.
  `;

  it('verifies findings against document text', () => {
    const analysis: LegalAnalysisResult = {
      documentTitle: 'Lease',
      documentType: 'Lease Agreement',
      overallRiskScore: 50,
      executiveSummary: 'Summary',
      targetRole: 'Tenant',
      targetConcern: 'Rent',
      findings: [
        {
          id: '1',
          category: 'Risk',
          title: 'Monthly Rent',
          summary: 'Rent due monthly',
          severity: 'High',
          confidence: 'High',
          exactQuote: 'Tenant shall pay a monthly rent of $5,000',
          explanation: 'Rent amount',
          whyItMatters: 'Financial cost',
          simplifiedVersion: 'Pay rent',
          suggestedAction: 'Pay on time'
        }
      ],
      keyObligations: [
        {
          obligation: 'Pay rent',
          deadlineOrCondition: 'First of month',
          responsibleParty: 'Tenant',
          exactQuote: 'Tenant shall pay a monthly rent of $5,000'
        }
      ],
      questionsForProfessional: ['What about late fees?'],
      optionsAndNextSteps: ['Sign lease']
    };

    const result = verifyEvidence(analysis, sampleDocument);
    expect(result.verifiedCount).toBeGreaterThan(0);
    expect(result.verifiedFindings[0].evidenceStatus).toBeDefined();
  });
});
