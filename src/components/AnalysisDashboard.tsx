/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { LegalAnalysisResult, LegalFinding } from '../lib/schema';
import { verifyEvidence } from '../lib/evidenceMatcher';
import { ShieldAlert, CheckCircle, AlertTriangle, FileText, Bot, HelpCircle, ArrowUpRight, Sparkles, BookOpen, Layers, Check, ChevronRight } from 'lucide-react';
import { LegalAssistantChat } from './LegalAssistantChat';
import { DocumentInspector } from './DocumentInspector';

interface AnalysisDashboardProps {
  analysis: LegalAnalysisResult;
  documentText: string;
  documentTitle: string;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, documentText, documentTitle }) => {
  const [activeTab, setActiveTab] = useState<'findings' | 'obligations' | 'questions' | 'chat' | 'inspector'>('findings');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFinding, setSelectedFinding] = useState<LegalFinding | null>(null);

  // Run deterministic evidence verification
  const verification = useMemo(() => {
    return verifyEvidence(analysis, documentText);
  }, [analysis, documentText]);

  const findings = verification.verifiedFindings;

  const filteredFindings = findings.filter(f => {
    if (selectedCategory === 'All') return true;
    return f.category === selectedCategory;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getEvidenceBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Verified in Document
          </span>
        );
      case 'partially_verified':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Partially Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5 text-neutral-500" />
            Unverified Claim
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner / Meta Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-md bg-neutral-100 text-neutral-800">
                {analysis.documentType || 'Legal Document'}
              </span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-neutral-600 font-medium">Role: <strong>{analysis.targetRole}</strong></span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-neutral-600 font-medium">Focus: <strong>{analysis.targetConcern}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">{documentTitle}</h1>
          </div>

          {/* Risk Score Meter */}
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-serif text-2xl font-bold ${
              analysis.overallRiskScore > 70 ? 'bg-red-100 text-red-700' : analysis.overallRiskScore > 40 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {analysis.overallRiskScore}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Calculated Risk Index</span>
              <span className="text-sm font-semibold text-neutral-900">
                {analysis.overallRiskScore > 70 ? 'High Financial / Legal Exposure' : analysis.overallRiskScore > 40 ? 'Moderate Exposure' : 'Favorable Terms'}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Executive Summary for {analysis.targetRole}</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{analysis.executiveSummary}</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">Evidence Verification</span>
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-700 mt-2">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" /> {verification.verifiedCount} Verified
                </span>
                <span className="flex items-center gap-1 text-neutral-600">
                  <AlertTriangle className="w-3.5 h-3.5" /> {verification.unverifiedCount + verification.partiallyVerifiedCount} Unverified
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span>Deterministic Match Rate</span>
              <span className="font-semibold text-neutral-900">
                {Math.round((verification.verifiedCount / Math.max(1, findings.length)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-200 gap-8">
        <button
          onClick={() => setActiveTab('findings')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'findings' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Prioritized Findings & Risks ({findings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('obligations')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'obligations' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Key Obligations Checklist ({analysis.keyObligations?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'questions' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Legal Professional Prep ({analysis.questionsForProfessional?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'chat' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Document Q&A Assistant</span>
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'inspector' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Document Text Inspector</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'findings' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Risk', 'Obligation', 'Right', 'Inconsistency', 'Definition'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategory === cat ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Findings List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredFindings.map((finding) => (
              <div
                key={finding.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:border-neutral-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800">
                      {finding.category}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity} Severity
                    </span>
                  </div>
                  <div>{getEvidenceBadge(finding.evidenceStatus)}</div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 mb-2 font-serif">{finding.title}</h3>
                <p className="text-sm text-neutral-700 mb-4 leading-relaxed">{finding.summary}</p>

                {/* Exact Quote & Source Verification */}
                <div className="bg-neutral-50 border-l-2 border-neutral-900 p-4 rounded-r-xl mb-4 font-mono text-xs text-neutral-800">
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-500 block mb-1">Verbatim Source Quote:</span>
                  "{finding.exactQuote}"
                </div>

                {/* Explanation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
                  <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                    <strong className="text-amber-900 block mb-1 font-semibold">Why It Matters to You:</strong>
                    <p className="text-neutral-700 leading-relaxed">{finding.whyItMatters || finding.explanation}</p>
                  </div>
                  <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                    <strong className="text-blue-900 block mb-1 font-semibold">Suggested Action / Remedy:</strong>
                    <p className="text-neutral-700 leading-relaxed">{finding.suggestedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'obligations' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h3 className="font-semibold text-base text-neutral-900 font-serif">Key Obligations & Deadlines Checklist</h3>
            <span className="text-xs text-neutral-500">Actionable responsibilities extracted from the document</span>
          </div>
          <div className="divide-y divide-neutral-200">
            {analysis.keyObligations?.map((item, idx) => (
              <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      Party: {item.responsibleParty}
                    </span>
                    <span className="text-xs text-neutral-500">·</span>
                    <span className="text-xs font-medium text-amber-700">{item.deadlineOrCondition}</span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 text-base">{item.obligation}</h4>
                  <p className="font-mono text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    "{item.exactQuote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 font-serif mb-2">Questions to Prepare for Your Legal Professional</h3>
            <p className="text-sm text-neutral-600">Take these precise questions to a qualified attorney to maximize your consultation efficiency.</p>
          </div>
          <div className="space-y-4">
            {analysis.questionsForProfessional?.map((q, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-neutral-900 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <h4 className="font-semibold text-sm text-neutral-900 mb-3">Recommended Next Steps:</h4>
            <ul className="space-y-2">
              {analysis.optionsAndNextSteps?.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'chat' && <LegalAssistantChat documentContext={documentText} />}

      {activeTab === 'inspector' && (
        <DocumentInspector documentTitle={documentTitle} documentText={documentText} />
      )}
    </div>
  );
};
