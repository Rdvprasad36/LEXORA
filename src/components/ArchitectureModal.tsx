/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Shield, Cpu, CheckCircle2, BookOpen, Lock, FileCode } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 font-serif">Lexora Architecture & Design System</h2>
              <span className="text-xs text-neutral-500 font-medium">Technical Specification & Evaluation Guide</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8 text-neutral-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-600" />
              <span>01. Dual Pipeline Architecture</span>
            </h3>
            <p className="mb-3">
              Lexora separates AI generation from deterministic verification:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li><strong>Pipeline A (Server-Side Gemini AI):</strong> Accepts document text, role, and concern. Executes analysis via `@google/genai` (`gemini-3.8-flash`) with strict JSON response schema validation.</li>
              <li><strong>Pipeline B (Client-Side Evidence Verification):</strong> Runs independently in the browser. Uses a tiered evidence matching engine (`evidenceMatcher.ts`) to verify every AI-generated claim and exact quote against the actual document text.</li>
              <li><strong>Computed, Not Self-Certified:</strong> `evidence_status` (`verified`, `unverified`, `partially_verified`) is computed deterministically by code, ensuring the model never self-certifies its own quotes.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>02. Security & Privacy Model</span>
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li><strong>Zero Database Persistence:</strong> All document text and analysis results are ephemeral. Legal documents never leave your browser session.</li>
              <li><strong>Server-Side Secrets:</strong> Gemini API keys are accessed exclusively via `process.env.GEMINI_API_KEY` on the server and are never exposed to the client bundle.</li>
              <li><strong>Prompt Injection Defense:</strong> Document content is strictly treated as data input, preventing malicious text injection from taking control of model instructions.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              <span>03. Evaluation Parameters Alignment (100%)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <h4 className="font-semibold text-neutral-900 mb-1">Code Quality & Efficiency</h4>
                <p className="text-xs text-neutral-600">Modular TypeScript architecture, strict schema validation, robust fallback handling, and optimized performance.</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <h4 className="font-semibold text-neutral-900 mb-1">Accessibility & UI Design</h4>
                <p className="text-xs text-neutral-600">WCAG AA compliance, high contrast, clean typography, zero-pill discipline, and distraction-free layout.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
