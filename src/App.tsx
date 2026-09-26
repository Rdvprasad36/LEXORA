/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ArchitectureModal } from './components/ArchitectureModal';
import { LegalAnalysisResult } from './lib/schema';

export default function App() {
  const [analysis, setAnalysis] = useState<LegalAnalysisResult | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);

  const handleAnalysisComplete = (result: LegalAnalysisResult, rawText: string, title: string) => {
    setAnalysis(result);
    setDocumentText(rawText);
    setDocumentTitle(title);
  };

  const handleReset = () => {
    setAnalysis(null);
    setDocumentText('');
    setDocumentTitle('');
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      <Header
        onReset={handleReset}
        onOpenArchitecture={() => setIsArchOpen(true)}
        hasAnalysis={!!analysis}
      />

      <main className="flex-1" id="main-content">
        {!analysis ? (
          <HeroLanding
            onAnalysisComplete={handleAnalysisComplete}
            onOpenArchitecture={() => setIsArchOpen(true)}
          />
        ) : (
          <AnalysisDashboard
            analysis={analysis}
            documentText={documentText}
            documentTitle={documentTitle}
          />
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 px-6 text-center text-xs text-neutral-500 mt-12">
        <p>© 2026 Lexora · AI for Legal Assistance & Access (PromptWars Virtual Exclusive Edition).</p>
        <p className="mt-1 text-neutral-400">Disclaimer: Lexora provides informational legal document analysis only and does not replace formal legal advice from a qualified attorney.</p>
      </footer>

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}
