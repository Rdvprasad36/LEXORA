import React, { useState } from 'react';
import { DocumentRecord } from '../types';
import { FileText, Sparkles, CheckCircle2 } from 'lucide-react';

interface SummaryTabProps {
  document: DocumentRecord;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ document }) => {
  const [level, setLevel] = useState<'executive' | 'standard' | 'detailed' | 'action'>('executive');
  const analysis = document.analysis;
  if (!analysis) return <div>No summary available.</div>;

  const getContent = () => {
    switch (level) {
      case 'standard': return analysis.standardSummary;
      case 'detailed': return analysis.detailedSummary;
      case 'action': return analysis.actionSummary;
      default: return analysis.executiveSummary;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Multi-Level Summarization</h3>
          <p className="text-sm text-slate-500">Choose the depth and focus of your document summary.</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['executive', 'standard', 'detailed', 'action'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                level === l ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 capitalize">{level} Summary</h4>
            <p className="text-xs text-slate-500">Generated for {document.filename}</p>
          </div>
        </div>

        <p className="text-base text-slate-700 leading-relaxed font-normal">{getContent()}</p>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Document Title
            </span>
            <span className="font-semibold text-slate-900 text-sm">{analysis.title}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Key Parties
            </span>
            <span className="font-semibold text-slate-900 text-sm">{analysis.parties.party1} & {analysis.parties.party2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
