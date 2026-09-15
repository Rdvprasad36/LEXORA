import React, { useState } from 'react';
import { DocumentRecord, ChecklistItem } from '../types';
import { CheckSquare, Square, FileCheck, Scale, Download } from 'lucide-react';

interface ChecklistTabProps {
  document: DocumentRecord;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ document }) => {
  const analysis = document.analysis;
  const [checklist, setChecklist] = useState<ChecklistItem[]>(analysis?.checklist || []);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, isChecked: !item.isChecked } : item));
  };

  if (!analysis) return <div>No checklist available.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Review Checklist & Lawyer Preparation</h3>
        <p className="text-sm text-slate-500">Actionable items to discuss and resolve prior to document execution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Negotiation & Review Checklist</span>
            </h4>
            <span className="text-xs font-medium text-slate-500">
              {checklist.filter(c => c.isChecked).length} of {checklist.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  item.isChecked
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                }`}
              >
                {item.isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2 pb-4 border-b border-slate-100">
            <Scale className="w-5 h-5 text-amber-600" />
            <span>Questions for Your Lawyer</span>
          </h4>

          <ul className="space-y-3 text-sm text-slate-700">
            {analysis.lawyerPrep.map((prep, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{prep}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => alert("Checklist and lawyer prep exported successfully as Markdown.")}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Preparation Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
