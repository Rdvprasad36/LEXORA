import React, { useState } from 'react';
import { DocumentRecord } from '../types';
import { OverviewTab } from './OverviewTab';
import { ClausesTab } from './ClausesTab';
import { RisksTab } from './RisksTab';
import { QATab } from './QATab';
import { CompareTab } from './CompareTab';
import { SummaryTab } from './SummaryTab';
import { ChecklistTab } from './ChecklistTab';
import { ArrowLeft, FileText, ShieldAlert, HelpCircle, GitCompare, FileCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface DocumentWorkspaceProps {
  document: DocumentRecord;
  allDocuments: DocumentRecord[];
  onBack: () => void;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({ document, allDocuments, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'risks' | 'qa' | 'compare' | 'summary' | 'checklist'>('overview');

  const analysis = document.analysis;
  const criticalRiskCount = analysis?.risks.filter(r => r.severity === 'critical' || r.severity === 'significant').length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold">Legal Disclaimer:</span> LEXORA provides informational analysis and document reasoning assistance. It is <span className="underline">not a lawyer</span> and does not create an attorney-client relationship. Always consult a licensed legal professional before signing or acting on any agreement.
        </div>
      </div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{document.filename}</h2>
              {criticalRiskCount > 0 && (
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-200">
                  {criticalRiskCount} Risks Flagged
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {analysis?.documentType || 'Legal Document'} • {(document.sizeBytes / 1024).toFixed(1)} KB • {document.pageCount} Pages
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            Analysis Complete
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'clauses', label: 'Clause Explorer', icon: FileText },
          { id: 'risks', label: 'Risk Triage', icon: ShieldAlert },
          { id: 'qa', label: 'Ask LEXORA', icon: HelpCircle },
          { id: 'compare', label: 'Compare', icon: GitCompare },
          { id: 'summary', label: 'Summaries', icon: Sparkles },
          { id: 'checklist', label: 'Checklist & Prep', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'overview' && analysis && <OverviewTab document={document} />}
        {activeTab === 'clauses' && analysis && <ClausesTab clauses={analysis.clauses} />}
        {activeTab === 'risks' && analysis && <RisksTab risks={analysis.risks} />}
        {activeTab === 'qa' && <QATab document={document} />}
        {activeTab === 'compare' && <CompareTab currentDocument={document} allDocuments={allDocuments} />}
        {activeTab === 'summary' && analysis && <SummaryTab document={document} />}
        {activeTab === 'checklist' && analysis && <ChecklistTab document={document} />}
      </div>
    </div>
  );
};
