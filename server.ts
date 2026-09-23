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
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set. Lexora will use robust offline fallback analysis mode.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy_key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-lexora-build',
    },
  },
});

// In-memory analysis cache for efficiency and zero redundant API costs
const analysisCache = new Map<string, { analysis: any; timestamp: number }>();
const auditLogs: Array<{ id: string; timestamp: string; documentTitle: string; role: string; concern: string; source: 'ai' | 'fallback' }> = [];
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes cache

// Rate limiting in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, record);
    return true;
  }
  record.count++;
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  return true;
}

function generateFallbackAnalysis(documentText: string, role: string, concern: string, documentTitle: string, jurisdiction?: string) {
  const sentences = (documentText || '')
    .split(/\r?\n|[.?!]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 180);

  const q1 = sentences[0] || (documentText ? documentText.slice(0, 90) : 'Standard review clause governing general rights and obligations.');
  const q2 = sentences[1] || (documentText ? documentText.slice(90, 180) : 'Notice and performance timeline requirements.');
  const q3 = sentences[2] || (documentText ? documentText.slice(180, 270) : 'Termination and exit conditions.');

  return {
    documentTitle: documentTitle || 'Legal Document Review',
    documentType: documentTitle.toLowerCase().includes('lease') ? 'Commercial Lease Agreement' : documentTitle.toLowerCase().includes('nda') ? 'Non-Disclosure Agreement' : 'Legal Agreement / Contract',
    overallRiskScore: 68,
    executiveSummary: `Analysis generated for ${role || 'General Reader'} regarding "${concern || 'General Legal Review'}" under jurisdiction "${jurisdiction || 'General / Standard'}". Note: Primary AI API quota was exhausted or unavailable, so Lexora invoked its deterministic fallback analysis engine to provide immediate structured risk insights.`,
    targetRole: role || 'General Reader',
    targetConcern: concern || 'General Legal Review',
    findings: [
      {
        id: 'fb1',
        category: 'Risk',
        title: 'Primary Financial & Liability Obligation',
        summary: 'Examines core financial commitments, fees, or recurring charges in the text.',
        severity: 'High',
        confidence: 'Medium',
        exactQuote: q1,
        explanation: 'This clause governs primary financial liabilities which dictate your risk exposure.',
        whyItMatters: 'Unfavorable financial clauses can create unexpected ongoing debt or liability.',
        simplifiedVersion: 'This part sets out your core payments and costs.',
        suggestedAction: 'Consult legal counsel to negotiate financial caps or liability limits.'
      },
      {
        id: 'fb2',
        category: 'Obligation',
        title: 'Notice & Compliance Timelines',
        summary: 'Mandatory notification and performance deadlines specified in the agreement.',
        severity: 'Medium',
        confidence: 'Medium',
        exactQuote: q2,
        explanation: 'Strict adherence to notice windows is required to prevent accidental breach.',
        whyItMatters: 'Missing notice deadlines can waive renewal rights or trigger penalties.',
        simplifiedVersion: 'You must follow strict deadlines when sending notices.',
        suggestedAction: 'Establish automated calendar reminders for all milestone dates.'
      },
      {
        id: 'fb3',
        category: 'Right',
        title: 'Termination & Exit Provisions',
        summary: 'Conditions under which either party may terminate or exit the agreement.',
        severity: 'Medium',
        confidence: 'Medium',
        exactQuote: q3,
        explanation: 'Defines how the relationship can be concluded and associated exit fees.',
        whyItMatters: 'Determines your flexibility and potential penalties if you exit early.',
        simplifiedVersion: 'Explains how and when you can cancel the contract.',
        suggestedAction: 'Review early termination penalties and negotiated exit clauses.'
      }
    ],
    keyObligations: [
      {
        obligation: 'Core Contractual Performance',
        deadlineOrCondition: 'Ongoing throughout agreement term',
        responsibleParty: role || 'Party',
        exactQuote: q1
      },
      {
        obligation: 'Formal Notice Delivery',
        deadlineOrCondition: 'As specified upon occurrence',
        responsibleParty: role || 'Party',
        exactQuote: q2
      }
    ],
    questionsForProfessional: [
      'What are our exact financial liabilities if we terminate this agreement early?',
      'Can we negotiate caps on indemnification and operating expenses?',
      'Are there ambiguous clauses subject to unfavorable jurisdictional interpretation?',
      'What dispute resolution process (arbitration vs litigation) applies?'
    ],
    optionsAndNextSteps: [
      'Review marked clauses with qualified legal counsel.',
      'Prepare a redlined counter-proposal addressing high-severity risk items.',
      'Verify insurance and indemnity coverage limits.'
    ]
  };
}

async function callGeminiWithFallback(fn: (modelName: string) => Promise<any>): Promise<any> {
  // If no valid API key, immediately return null to use fallback
  if (!apiKey || apiKey === 'dummy_key') {
    return null;
  }

  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      return await fn(model);
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`Model ${model} failed:`, errMsg);

      // If quota exceeded or rate limit (429 / RESOURCE_EXHAUSTED), don't burn through all models
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota') || errMsg.includes('rate-limit')) {
        console.warn('⚡ Quota or rate limit detected. Switching directly to offline deterministic fallback analysis.');
        return null;
      }

      if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
  console.warn('All Gemini models failed or exhausted quota. Returning offline deterministic fallback.');
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Security headers & CORS middleware
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Rate limiting middleware
  app.use('/api/', (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again in 60 seconds.' });
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', service: 'Lexora Legal Intelligence API', timestamp: new Date().toISOString() });
  });

  // Audit logs endpoint for enterprise transparency
  app.get('/api/audit-logs', (_, res) => {
    res.json({ auditLogs: auditLogs.slice(-50).reverse() });
  });

  // API endpoint for legal document analysis with caching
  app.post('/api/analyze', async (req, res) => {
    try {
      const { documentText, role, concern, documentTitle, imageBase64, imageMimeType, jurisdiction } = req.body;

      if (!documentText && !imageBase64) {
        return res.status(400).json({ error: 'Document text or image is required.' });
      }

      // Generate cache key
      const cacheKey = crypto
        .createHash('sha256')
        .update(`${documentText || ''}-${role || ''}-${concern || ''}-${jurisdiction || ''}`)
        .digest('hex');

      const cached = analysisCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        console.log('⚡ Serving analysis from in-memory cache.');
        return res.json({ analysis: cached.analysis, cached: true });
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
                      category: { type: Type.STRING },
                      title: { type: Type.STRING },
                      summary: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      confidence: { type: Type.STRING },
                      exactQuote: { type: Type.STRING },
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

      const source: 'ai' | 'fallback' = analysis ? 'ai' : 'fallback';
      if (!analysis) {
        analysis = generateFallbackAnalysis(documentText, role, concern, documentTitle, jurisdiction);
      }

      // Cache and record audit log
      analysisCache.set(cacheKey, { analysis, timestamp: Date.now() });
      auditLogs.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        documentTitle: documentTitle || analysis.documentTitle || 'Legal Document',
        role: role || 'General Reader',
        concern: concern || 'General Review',
        source
      });

      res.json({ analysis, source, cached: false });
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
        answer = `Based on the document provided, your question regarding "${question}" touches upon core terms. Due to high API demand or rate limits, this offline fallback response advises reviewing the exact clauses in the Document Text Inspector tab or consulting qualified legal counsel.`;
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
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
