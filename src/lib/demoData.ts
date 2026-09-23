/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LegalAnalysisResult } from './schema';

export interface DemoContext {
  id: string;
  title: string;
  role: string;
  concern: string;
  documentType: string;
  documentText: string;
  analysis: LegalAnalysisResult;
}

export const DEMO_CONTEXTS: DemoContext[] = [
  {
    id: 'commercial-lease-tenant',
    title: 'Commercial Lease Agreement — Suite 400 (Retail & Office)',
    role: 'Small Business Tenant',
    concern: 'Financial Exposure & CAM Charges',
    documentType: 'Commercial Lease Agreement',
    documentText: `COMMERCIAL LEASE AGREEMENT
THIS LEASE AGREEMENT (the "Lease") is entered into as of January 15, 2025, by and between METRO PROPERTIES LLC ("Landlord") and ARTISAN BAKERY CAFE INC ("Tenant").

1. PREMISES. Landlord hereby leases to Tenant and Tenant leases from Landlord that certain commercial space known as Suite 400, containing approximately 2,400 rentable square feet located at 750 Market Street, San Francisco, CA (the "Premises").

2. TERM. The term of this Lease shall be for five (5) years, commencing on March 1, 2025 (the "Commencement Date") and expiring on February 28, 2030 (the "Expiration Date").

3. BASE RENT. Tenant shall pay to Landlord as base rent the sum of $8,500.00 per month, due on the first day of each calendar month. Base rent shall escalate by five percent (5%) annually on each anniversary of the Commencement Date.

4. ADDITIONAL RENT AND CAM CHARGES. In addition to Base Rent, Tenant shall pay its Pro Rata Share (defined as 12.5%) of all Common Area Maintenance (CAM) expenses, operating costs, property taxes, and building insurance premiums. CAM charges shall be billed monthly in estimated installments and reconciled annually within 120 days after the end of each calendar year. Tenant shall be responsible for its share of capital expenditures incurred by Landlord for building roof replacement and HVAC overhauls if amortized over the useful life.

5. SECURITY DEPOSIT. Tenant shall deposit with Landlord the sum of $25,500.00 upon execution of this Lease as security for the faithful performance of all terms. Landlord may retain security deposit funds for up to sixty (60) days following lease termination.

6. DEFAULT AND TERMINATION. If Tenant fails to pay Base Rent or Additional Rent within five (5) days after written notice of delinquency, Landlord may declare an immediate default. Landlord reserves the right to accelerate all remaining rent payments for the remainder of the 5-year term upon uncured default. Tenant has no right of early termination without paying a termination fee equal to twelve (12) months of current Base Rent plus unamortized broker commissions.

7. ASSIGNMENT AND SUBLETTING. Tenant shall not assign this Lease or sublease any portion of the Premises without prior written consent of Landlord, which consent may be withheld in Landlord's sole and absolute discretion. Any permitted assignment shall not release Tenant from primary liability under this Lease.

8. GOVERNING LAW. This Lease shall be governed by and construed in accordance with the laws of the State of California.`,
    analysis: {
      documentTitle: 'Commercial Lease Agreement — Suite 400',
      documentType: 'Commercial Lease Agreement',
      overallRiskScore: 78,
      executiveSummary: 'This commercial lease places significant financial exposure on the tenant through uncapped CAM capital expenditures, mandatory 5% annual base rent escalations, and strict rent acceleration clauses upon default without early exit rights.',
      targetRole: 'Small Business Tenant',
      targetConcern: 'Financial Exposure & CAM Charges',
      findings: [
        {
          id: 'f1',
          category: 'Risk',
          title: 'Uncapped CAM Capital Expenditures for Roof & HVAC',
          summary: 'Tenant is required to pay its Pro Rata Share (12.5%) of capital expenditures for roof replacement and HVAC overhauls amortized over useful life.',
          severity: 'High',
          confidence: 'High',
          exactQuote: 'Tenant shall be responsible for its share of capital expenditures incurred by Landlord for building roof replacement and HVAC overhauls if amortized over the useful life.',
          explanation: 'Building structural elements like roofs and HVAC systems are traditionally landlord capital expenses. Passing these costs to tenants can result in unexpected thousands of dollars in surprise bills.',
          whyItMatters: 'As a small business tenant, absorbing major structural capital improvements can severely strain cash flow.',
          simplifiedVersion: 'You have to pay for part of the roof and AC repairs.',
          suggestedAction: 'Negotiate a cap on capital expenditures or exclude structural roof/HVAC replacement entirely from tenant operating expenses.'
        },
        {
          id: 'f2',
          category: 'Risk',
          title: 'Rent Acceleration Upon Default',
          summary: 'Landlord can accelerate all remaining rent payments for the remainder of the 5-year term upon any uncured default.',
          severity: 'Critical',
          confidence: 'High',
          exactQuote: 'Landlord reserves the right to accelerate all remaining rent payments for the remainder of the 5-year term upon uncured default.',
          explanation: 'If your business faces temporary cash flow difficulty and defaults, the landlord can demand immediate payment of all rent for all remaining years instantly.',
          whyItMatters: 'Creates catastrophic liability in the event of business downturns.',
          simplifiedVersion: 'If you miss a rent payment, the landlord can demand all future rent for the entire lease right now.',
          suggestedAction: 'Strike acceleration clauses or require landlord to mitigate damages by attempting to re-let the space first.'
        },
        {
          id: 'f3',
          category: 'Obligation',
          title: 'Annual 5% Rent Escalation',
          summary: 'Base rent increases by 5% every single year.',
          severity: 'Medium',
          confidence: 'High',
          exactQuote: 'Base rent shall escalate by five percent (5%) annually on each anniversary of the Commencement Date.',
          explanation: 'A compounding 5% annual increase outpaces standard inflation in many markets, significantly raising operating costs by year 5.',
          whyItMatters: 'Your monthly rent will grow from $8,500 to over $10,300 by year 5.',
          simplifiedVersion: 'Your rent goes up by 5% every year automatically.',
          suggestedAction: 'Negotiate a lower escalation rate (e.g., 3%) or tie increases to Consumer Price Index (CPI) with a cap.'
        },
        {
          id: 'f4',
          category: 'Right',
          title: 'Security Deposit Return Timeline',
          summary: 'Landlord has up to 60 days to return the $25,500 security deposit after lease termination.',
          severity: 'Low',
          confidence: 'High',
          exactQuote: 'Landlord may retain security deposit funds for up to sixty (60) days following lease termination.',
          explanation: '60 days is longer than the statutory 21-day limit typically mandated in California commercial/residential contexts.',
          whyItMatters: 'Ties up substantial working capital ($25,500) when you are moving locations.',
          simplifiedVersion: 'Landlord takes up to 2 months to give back your deposit.',
          suggestedAction: 'Request standard 30-day return timeline.'
        }
      ],
      keyObligations: [
        {
          obligation: 'Monthly Base Rent Payment',
          deadlineOrCondition: 'Due on the 1st day of each calendar month ($8,500.00)',
          responsibleParty: 'Tenant',
          exactQuote: 'Tenant shall pay to Landlord as base rent the sum of $8,500.00 per month, due on the first day of each calendar month.'
        },
        {
          obligation: 'Pro Rata CAM & Tax Share',
          deadlineOrCondition: 'Billed monthly in estimated installments, reconciled annually',
          responsibleParty: 'Tenant',
          exactQuote: 'Tenant shall pay its Pro Rata Share (defined as 12.5%) of all Common Area Maintenance (CAM) expenses, operating costs, property taxes, and building insurance premiums.'
        },
        {
          obligation: 'Security Deposit Remittance',
          deadlineOrCondition: '$25,500 due upon lease execution',
          responsibleParty: 'Tenant',
          exactQuote: 'Tenant shall deposit with Landlord the sum of $25,500.00 upon execution of this Lease as security for the faithful performance of all terms.'
        }
      ],
      questionsForProfessional: [
        'Can we negotiate a cap on annual CAM increases (e.g., maximum 5% controllable CAM growth)?',
        'How can we remove structural capital expenditures (roof, HVAC) from tenant obligations?',
        'Is rent acceleration enforceable in California without a mitigation of damages requirement?',
        'Can we add a quiet enjoyment and casualty/condemnation abatement clause?'
      ],
      optionsAndNextSteps: [
        'Request a redlined lease markup from legal counsel before signing or wiring deposit funds.',
        'Obtain historical CAM expense statements for the building to evaluate actual operating cost exposure.',
        'Propose a tenant improvement (TI) allowance or rent abatement period for initial setup.'
      ]
    }
  },
  {
    id: 'commercial-lease-landlord',
    title: 'Commercial Lease Agreement — Suite 400 (Landlord View)',
    role: 'Landlord',
    concern: 'Exit / Renewal Obligations & Default Protections',
    documentType: 'Commercial Lease Agreement',
    documentText: `COMMERCIAL LEASE AGREEMENT
THIS LEASE AGREEMENT (the "Lease") is entered into as of January 15, 2025, by and between METRO PROPERTIES LLC ("Landlord") and ARTISAN BAKERY CAFE INC ("Tenant").

1. PREMISES. Landlord hereby leases to Tenant and Tenant leases from Landlord that certain commercial space known as Suite 400, containing approximately 2,400 rentable square feet located at 750 Market Street, San Francisco, CA (the "Premises").

2. TERM. The term of this Lease shall be for five (5) years, commencing on March 1, 2025 (the "Commencement Date") and expiring on February 28, 2030 (the "Expiration Date").

3. BASE RENT. Tenant shall pay to Landlord as base rent the sum of $8,500.00 per month, due on the first day of each calendar month. Base rent shall escalate by five percent (5%) annually on each anniversary of the Commencement Date.

4. ADDITIONAL RENT AND CAM CHARGES. In addition to Base Rent, Tenant shall pay its Pro Rata Share (defined as 12.5%) of all Common Area Maintenance (CAM) expenses, operating costs, property taxes, and building insurance premiums. CAM charges shall be billed monthly in estimated installments and reconciled annually within 120 days after the end of each calendar year. Tenant shall be responsible for its share of capital expenditures incurred by Landlord for building roof replacement and HVAC overhauls if amortized over the useful life.

5. SECURITY DEPOSIT. Tenant shall deposit with Landlord the sum of $25,500.00 upon execution of this Lease as security for the faithful performance of all terms. Landlord may retain security deposit funds for up to sixty (60) days following lease termination.

6. DEFAULT AND TERMINATION. If Tenant fails to pay Base Rent or Additional Rent within five (5) days after written notice of delinquency, Landlord may declare an immediate default. Landlord reserves the right to accelerate all remaining rent payments for the remainder of the 5-year term upon uncured default. Tenant has no right of early termination without paying a termination fee equal to twelve (12) months of current Base Rent plus unamortized broker commissions.

7. ASSIGNMENT AND SUBLETTING. Tenant shall not assign this Lease or sublease any portion of the Premises without prior written consent of Landlord, which consent may be withheld in Landlord's sole and absolute discretion. Any permitted assignment shall not release Tenant from primary liability under this Lease.

8. GOVERNING LAW. This Lease shall be governed by and construed in accordance with the laws of the State of California.`,
    analysis: {
      documentTitle: 'Commercial Lease Agreement — Suite 400',
      documentType: 'Commercial Lease Agreement',
      overallRiskScore: 22,
      executiveSummary: 'This lease heavily protects the landlord with strict assignment restrictions, robust default remedies including rent acceleration, no early termination rights without a 12-month fee, and full tenant participation in CAM and capital maintenance costs.',
      targetRole: 'Landlord',
      targetConcern: 'Exit / Renewal Obligations & Default Protections',
      findings: [
        {
          id: 'lf1',
          category: 'Right',
          title: 'Strong Default Remedies & Rent Acceleration',
          summary: 'Landlord can accelerate all remaining rent for the 5-year term upon uncured default after 5 days notice.',
          severity: 'Low',
          confidence: 'High',
          exactQuote: 'Landlord reserves the right to accelerate all remaining rent payments for the remainder of the 5-year term upon uncured default.',
          explanation: 'Provides robust legal protection to secure cash flow and remedies if the tenant fails to meet payment obligations.',
          whyItMatters: 'Ensures landlord is fully protected against tenant abandonment or payment default.',
          simplifiedVersion: 'You can demand all remaining rent if they default.',
          suggestedAction: 'Ensure notice and cure periods align with local California commercial leasing statutes.'
        },
        {
          id: 'lf2',
          category: 'Right',
          title: 'Strict Assignment & Subletting Control',
          summary: 'Tenant cannot assign or sublease without landlord absolute discretion consent, and original tenant remains primarily liable.',
          severity: 'Low',
          confidence: 'High',
          exactQuote: 'Tenant shall not assign this Lease or sublease any portion of the Premises without prior written consent of Landlord, which consent may be withheld in Landlord\'s sole and absolute discretion.',
          explanation: 'Prevents unwanted subtenants and ensures continuity of creditworthy tenancy.',
          whyItMatters: 'Maintains property asset quality and tenant covenant strength.',
          simplifiedVersion: 'They cannot sublease without your permission.',
          suggestedAction: 'Maintain this clause as drafted to protect building tenancy standards.'
        },
        {
          id: 'lf3',
          category: 'Obligation',
          title: 'No Unilateral Early Termination Rights',
          summary: 'Tenant has zero right to exit early without paying a 12-month base rent termination fee plus broker commissions.',
          severity: 'Low',
          confidence: 'High',
          exactQuote: 'Tenant has no right of early termination without paying a termination fee equal to twelve (12) months of current Base Rent plus unamortized broker commissions.',
          explanation: 'Secures the full 5-year revenue stream and deters premature vacancy.',
          whyItMatters: 'Guarantees lease term stability for property valuation.',
          simplifiedVersion: 'They cannot leave early without paying a full year of rent.',
          suggestedAction: 'Keep termination fee terms intact to prevent unexpected vacancy.'
        }
      ],
      keyObligations: [
        {
          obligation: 'Monthly Rent Collection',
          deadlineOrCondition: '$8,500.00 due on 1st of each month with 5% annual escalation',
          responsibleParty: 'Tenant',
          exactQuote: 'Tenant shall pay to Landlord as base rent the sum of $8,500.00 per month, due on the first day of each calendar month.'
        },
        {
          obligation: 'Security Deposit Holding',
          deadlineOrCondition: '$25,500.00 held up to 60 days post-termination',
          responsibleParty: 'Landlord',
          exactQuote: 'Tenant shall deposit with Landlord the sum of $25,500.00 upon execution of this Lease as security for the faithful performance of all terms.'
        }
      ],
      questionsForProfessional: [
        'Should we require personal guarantees from the tenant principals?',
        'Is our CAM reconciliation timeline of 120 days compliant with current operating budgets?',
        'Do we need an explicit holdover rent penalty clause (e.g., 150% of base rent)?'
      ],
      optionsAndNextSteps: [
        'Execute lease agreement upon receipt of signed documents and security deposit wire.',
        'Verify certificate of insurance naming Landlord as additional insured prior to occupancy hand-off.'
      ]
    }
  }
];
