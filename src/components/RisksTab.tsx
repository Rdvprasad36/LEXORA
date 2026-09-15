import React from 'react';
import { RiskFinding } from '../types';
import { ShieldAlert, AlertTriangle, Info, CheckCircle, ArrowRight } from 'lucide-react';

interface RisksTabProps {
  risks: RiskFinding[];
}

export const RisksTab: React.FC<RisksTabProps> = ({ risks }) => {
  const getSeverityBadge = (severity: RiskFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Critical Risk</span>
          </span>
        );
      case 'significant':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full border border-orange-200">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
            <span>Significant Risk</span>
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Attention Needed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Informational</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Risk Triage & Asymmetry Analysis</h3>
        <p className="text-sm text-slate-500">Evaluated against market-standard benchmarks with rationale and consequences.</p>
      </div>

      <div className="space-y-4">
        {risks.map((risk) => (
          <div key={risk.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                {getSeverityBadge(risk.severity)}
                <h4 className="font-semibold text-slate-900 text-base">{risk.category}</h4>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Confidence: {Math.round(risk.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Why This Matters (Rationale)
                </span>
                <p className="text-sm text-slate-700">{risk.rationale}</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                <span className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
                  Potential Consequence
                </span>
                <p className="text-sm text-rose-900">{risk.potentialConsequence}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
                  Suggested User Action
                </span>
                <p className="text-sm text-emerald-950 font-medium">{risk.suggestedAction}</p>
              </div>
            </div>

            {risk.citation && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="italic truncate max-w-xl">Source: "{risk.citation.quote}"</span>
                <span className="font-medium text-amber-700 shrink-0">Char {risk.citation.charStart}-{risk.citation.charEnd}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
