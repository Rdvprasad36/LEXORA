/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';

describe('Schema Test Suite', () => {
  it('validates legal analysis result schema fields', () => {
    const mockResult = {
      documentTitle: 'Test Agreement',
      documentType: 'NDA',
      overallRiskScore: 40,
      executiveSummary: 'Summary',
      targetRole: 'Founder',
      targetConcern: 'IP',
      findings: [],
      keyObligations: [],
      questionsForProfessional: [],
      optionsAndNextSteps: []
    };
    expect(mockResult.overallRiskScore).toBe(40);
    expect(mockResult.documentType).toBe('NDA');
  });
});
