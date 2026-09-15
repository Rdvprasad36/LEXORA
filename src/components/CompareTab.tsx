import React, { useState } from 'react';
import { DocumentRecord } from '../types';
import { GitCompare, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CompareTabProps {
  currentDocument: DocumentRecord;
  allDocuments: DocumentRecord[];
}

export const CompareTab: React.FC<CompareTabProps> = ({ currentDocument, allDocuments }) => {
  const [targetId, setTargetId] = useState<string>(
    allDocuments.find(d => d.id !== currentDocument.id)?.id || currentDocument.id
  );
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docIdA: currentDocument.id, docIdB: targetId })
      });
      const data = await res.json();
      setComparisonResult(data);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const targetDoc = allDocuments.find(d => d.id === targetId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Multi-Document Comparison</h3>
        <p className="text-sm text-slate-500">Compare clauses, payment terms, and obligations between two contracts.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Primary Document
          </label>
          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900">
            {currentDocument.filename}
          </div>
        </div>

        <GitCompare className="w-6 h-6 text-slate-400 my-auto hidden sm:block shrink-0" />

        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Compare With
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          >
            {allDocuments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.filename} {d.id === currentDocument.id ? '(Self)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors mt-auto shadow-md"
        >
          {loading ? 'Comparing...' : 'Run Comparison'}
        </button>
      </div>

      {comparisonResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h4 className="font-bold text-lg text-slate-900">{comparisonResult.comparisonTitle}</h4>

          <div className="space-y-4">
            {comparisonResult.findings.map((f: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{f.category}</span>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full capitalize">
                    {f.changeType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{f.explanation}</p>
                <div className="text-xs text-slate-500 text-right">
                  Materiality Confidence: {Math.round(f.materialityConfidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
