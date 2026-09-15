import React, { useState } from 'react';
import { ClauseItem } from '../types';
import { FileText, HelpCircle, ArrowRight, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface ClausesTabProps {
  clauses: ClauseItem[];
}

export const ClausesTab: React.FC<ClausesTabProps> = ({ clauses }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(clauses[0]?.id || null);

  const categories = ['all', 'payment', 'termination', 'liability', 'ip', 'indemnity', 'other'];

  const filteredClauses = filterCategory === 'all'
    ? clauses
    : clauses.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Clause Intelligence & Explanation</h3>
          <p className="text-sm text-slate-500">Plain-language breakdown and importance scoring of every clause.</p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredClauses.map((clause) => {
          const isExpanded = expandedId === clause.id;
          return (
            <div
              key={clause.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : clause.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900 capitalize">{clause.category} Clause</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        clause.importance === 'critical' ? 'bg-rose-100 text-rose-800' :
                        clause.importance === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {clause.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{clause.plainExplanation}</p>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/30">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Original Verbatim Text
                    </span>
                    <blockquote className="p-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 italic">
                      "{clause.originalText}"
                    </blockquote>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Plain Language Explanation
                    </span>
                    <p className="text-sm text-slate-800 font-medium bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50">
                      {clause.plainExplanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
                        Potential Concern
                      </span>
                      <p className="text-xs text-slate-600">{clause.potentialConcern}</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <span className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                        Suggested Next Step
                      </span>
                      <p className="text-xs text-slate-600">{clause.suggestedNextStep}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
