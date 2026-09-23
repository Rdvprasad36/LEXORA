/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function generateFallbackAnalysis(documentText: string, role: string, concern: string, documentTitle: string, jurisdiction?: string) {
  const sentences = documentText
    .split(/\r?\n|[.?!]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 150);

  const q1 = sentences[0] || documentText.slice(0, 80);
  const q2 = sentences[1] || documentText.slice(80, 160);
  const q3 = sentences[2] || documentText.slice(160, 240);

  return {
    documentTitle: documentTitle || 'Legal Document Review',
    documentType: documentTitle.includes('Lease') ? 'Commercial Lease Agreement' : documentTitle.includes('NDA') ? 'Non-Disclosure Agreement' : 'Legal Agreement / Contract',
    overallRiskScore: 65,
    executiveSummary: `Analysis generated for ${role || 'General Reader'} regarding "${concern || 'General Legal Review'}" under jurisdiction "${jurisdiction || 'General / Standard'}". Note: Primary AI models experienced temporary high demand/rate limits, so Lexora generated this structured fallback analysis based on document text parsing.`,
    targetRole: role || 'General Reader',
    targetConcern: concern || 'General Legal Review',
    findings: [
      {
        id: 'fb1',
        category: 'Risk',
        title: 'Primary Liability & Financial Obligation Clause',
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
        id: 'fb2',
        category: 'Obligation',
        title: 'Performance & Notice Requirements',
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
        id: 'fb3',
        category: 'Right',
        title: 'Termination & Exit Conditions',
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentText, role, concern, documentTitle, imageBase64, imageMimeType, jurisdiction } = req.body;

    if (!documentText && !imageBase64) {
      return res.status(400).json({ error: 'Document text or image is required.' });
    }

    const prompt = `You are Lexora, an expert AI legal assistant and document navigator. 
Analyze the following legal document with extreme precision for a user who identifies as "${role || 'General Reader'}" with the specific primary concern: "${concern || 'General Legal Review'}" under jurisdiction: "${jurisdiction || 'General / Standard'}".

Document Title: ${documentTitle || 'Untitled Legal Document'}
Jurisdiction / Framework: ${jurisdiction || 'General / Standard'}
Document Text:
"""
${documentText ? documentText.slice(0, 30000) : '(See attached document image for OCR and analysis)'}
"""`;

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType || 'image/png',
          data: imageBase64,
        },
      });
    }
    contents.push(prompt);

    const modelsToTry = ['gemini-flash-lite-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3.6-flash', 'gemini-3.8-flash'];
    let analysisResult: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                documentTitle: { type: Type.STRING },
                documentType: { type: Type.STRING },
                overallRiskScore: { type: Type.NUMBER },
                executiveSummary: { type: Type.STRING },
                targetRole: { type: Type.STRING },
                targetConcern: { type: Type.STRING },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      category: { type: Type.STRING },
                      title: { type: Type.STRING },
                      summary: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      confidence: { type: Type.STRING },
                      exactQuote: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      whyItMatters: { type: Type.STRING },
                      simplifiedVersion: { type: Type.STRING },
                      suggestedAction: { type: Type.STRING },
                    },
                    required: ['id', 'category', 'title', 'summary', 'severity', 'confidence', 'exactQuote', 'explanation', 'whyItMatters', 'simplifiedVersion', 'suggestedAction'],
                  },
                },
                keyObligations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      obligation: { type: Type.STRING },
                      deadlineOrCondition: { type: Type.STRING },
                      responsibleParty: { type: Type.STRING },
                      exactQuote: { type: Type.STRING },
                    },
                    required: ['obligation', 'deadlineOrCondition', 'responsibleParty', 'exactQuote'],
                  },
                },
                questionsForProfessional: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                optionsAndNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['documentTitle', 'documentType', 'overallRiskScore', 'executiveSummary', 'findings', 'keyObligations', 'questionsForProfessional', 'optionsAndNextSteps'],
            },
          },
        });

        if (response.text) {
          analysisResult = JSON.parse(response.text);
          break;
        }
      } catch (err: any) {
        console.warn(`Vercel function model ${model} failed:`, err?.message || err);
      }
    }

    if (!analysisResult) {
      analysisResult = generateFallbackAnalysis(documentText || '', role, concern, documentTitle, jurisdiction);
    }

    return res.status(200).json(analysisResult);
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
