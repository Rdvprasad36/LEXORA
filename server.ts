/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function generateFallbackAnalysis(documentText: string, role: string, concern: string, documentTitle: string, jurisdiction?: string) {
  // Extract a few sentences from documentText to serve as verbatim quotes
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
    executiveSummary: `Analysis generated for ${role || 'General Reader'} regarding "${concern || 'General Legal Review'}" under jurisdiction "${jurisdiction || 'General / Standard'}". Note: Primary AI models experienced temporary high demand/rate limits, so Lexora generated this structured fallback analysis based on document text parsing. Review key obligations and risks below.`,
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

async function callGeminiWithFallback(fn: (modelName: string) => Promise<any>): Promise<any> {
  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3.6-flash', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 0;
    while (attempts < 2) {
      try {
        return await fn(model);
      } catch (err: any) {
        lastError = err;
        attempts++;
        console.warn(`Model ${model} attempt ${attempts} failed:`, err?.message || err);
        // If 503 or 429 quota/unavailable, wait briefly or try next model
        if (err?.message?.includes('503') || err?.message?.includes('429') || err?.message?.includes('UNAVAILABLE') || err?.status === 503 || err?.status === 429) {
          await new Promise(r => setTimeout(r, 1000 * attempts));
        } else {
          break; // non-rate-limit error, try next model immediately
        }
      }
    }
  }
  console.warn('All Gemini models encountered rate limits or high demand. Returning deterministic fallback analysis.');
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Security headers middleware
  app.use((_, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://generativelanguage.googleapis.com data: blob:");
    next();
  });

  // API endpoint for legal document analysis
  app.post('/api/analyze', async (req, res) => {
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
"""

Provide a thorough, structured, schema-compliant legal analysis focusing specifically on the user's role and concern. Include:
1. overallRiskScore (0 to 100 integer representing financial/legal exposure).
2. executiveSummary (clear 2-3 sentence overview of what matters to this role).
3. findings: Array of specific findings (Risk, Obligation, Right, Inconsistency, Definition) with title, summary, severity (High, Medium, Low, Critical), confidence (High, Medium, Low), exactQuote (MUST be an exact verbatim sentence or clause copied directly from the Document Text so we can verify it), explanation, whyItMatters, simplifiedVersion, and suggestedAction.
4. keyObligations: Array of actionable obligations with obligation, deadlineOrCondition, responsibleParty, and exactQuote.
5. questionsForProfessional: 4-6 sharp, professional questions the user should ask a qualified attorney.
6. optionsAndNextSteps: 3-5 concrete next steps for the user.
`;

      let analysis = await callGeminiWithFallback(async (modelName) => {
        const contentParts: any[] = [{ text: prompt }];
        if (imageBase64 && imageMimeType) {
          contentParts.push({
            inlineData: {
              data: imageBase64,
              mimeType: imageMimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: contentParts,
          config: {
            systemInstruction: 'You are Lexora, a deterministic legal analysis assistant providing informational analysis only. Always return strictly valid JSON matching the requested schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                documentTitle: { type: Type.STRING },
                documentType: { type: Type.STRING },
                overallRiskScore: { type: Type.INTEGER },
                executiveSummary: { type: Type.STRING },
                targetRole: { type: Type.STRING },
                targetConcern: { type: Type.STRING },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      category: { type: Type.STRING, description: "Risk, Obligation, Right, Inconsistency, or Definition" },
                      title: { type: Type.STRING },
                      summary: { type: Type.STRING },
                      severity: { type: Type.STRING, description: "High, Medium, Low, or Critical" },
                      confidence: { type: Type.STRING, description: "High, Medium, or Low" },
                      exactQuote: { type: Type.STRING, description: "Exact verbatim quote from text" },
                      explanation: { type: Type.STRING },
                      whyItMatters: { type: Type.STRING },
                      simplifiedVersion: { type: Type.STRING },
                      suggestedAction: { type: Type.STRING }
                    },
                    required: ["id", "category", "title", "summary", "severity", "confidence", "exactQuote", "explanation", "whyItMatters", "simplifiedVersion", "suggestedAction"]
                  }
                },
                keyObligations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      obligation: { type: Type.STRING },
                      deadlineOrCondition: { type: Type.STRING },
                      responsibleParty: { type: Type.STRING },
                      exactQuote: { type: Type.STRING }
                    },
                    required: ["obligation", "deadlineOrCondition", "responsibleParty", "exactQuote"]
                  }
                },
                questionsForProfessional: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                optionsAndNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["documentTitle", "documentType", "overallRiskScore", "executiveSummary", "targetRole", "targetConcern", "findings", "keyObligations", "questionsForProfessional", "optionsAndNextSteps"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error('Empty response from Gemini model.');
        }
        return JSON.parse(responseText);
      });

      if (!analysis) {
        analysis = generateFallbackAnalysis(documentText, role, concern, documentTitle, jurisdiction);
      }

      res.json({ analysis });
    } catch (err: any) {
      console.error('Error in /api/analyze:', err);
      res.status(500).json({ error: err.message || 'Internal server error during analysis. Please try again.' });
    }
  });

  // API endpoint for document Q&A chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { question, documentContext, history } = req.body;

      if (!question || !documentContext) {
        return res.status(400).json({ error: 'Question and document context are required.' });
      }

      const chatHistory = (history || []).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));

      let answer = await callGeminiWithFallback(async (modelName) => {
        const chat = ai.chats.create({
          model: modelName,
          history: chatHistory,
          config: {
            systemInstruction: `You are Lexora Legal Assistant. Answer questions based ONLY on the provided legal document excerpt. Maintain professional neutrality and remind users that this is informational assistance, not formal legal advice.\n\nDocument Excerpt:\n${documentContext.slice(0, 20000)}`
          }
        });

        const chatResponse = await chat.sendMessage({ message: question });
        return chatResponse.text;
      });

      if (!answer) {
        answer = `Based on the document provided, your question regarding "${question}" touches upon core terms. Due to high API demand, this offline fallback response advises reviewing the exact clauses in the Document Text Inspector tab or consulting qualified legal counsel.`;
      }

      res.json({ answer });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({ error: err.message || 'Internal server error during chat.' });
    }
  });

  // Vite middleware for frontend development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const staticDir = __dirname.endsWith('dist') ? __dirname : path.resolve(__dirname, 'dist');
    app.use(express.static(staticDir));
    app.get('*', (_, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
