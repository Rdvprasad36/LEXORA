import React from 'react';
import { DocumentRecord } from '../types';
import { ShieldAlert, AlertTriangle, Info, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';

interface OverviewTabProps {
  document: DocumentRecord;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ document }) => {
  const analysis = document.analysis;
  if (!analysis) return <div>No analysis available.</div>;

  const riskCounts = {
    critical: analysis.risks.filter(r => r.severity === 'critical').length,
    significant: analysis.risks.filter(r => r.severity === 'significant').length,
    attention: analysis.risks.filter(r => r.severity === 'attention').length,
    informational: analysis.risks.filter(r => r.severity === 'informational').length,
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold mb-3">
          <FileText className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg">Executive Summary</h3>
        </div>
        <p className="text-slate-600 leading-relaxed text-base">{analysis.executiveSummary}</p>
      </div>

      {/* Grid: Document Metadata & Risk Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs md:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span>Key Parties & Metadata</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-500 mb-1">Document Type</span>
              <span className="font-medium text-slate-900">{analysis.documentType}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-500 mb-1">Parties Involved</span>
              <span className="font-medium text-slate-900">{analysis.parties.party1} & {analysis.parties.party2}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-500 mb-1">Effective Date</span>
              <span className="font-medium text-slate-900">{analysis.effectiveDate}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="block text-xs text-slate-500 mb-1">Expiration / Term</span>
              <span className="font-medium text-slate-900">{analysis.expirationDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Risk Triage Overview</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-rose-50 text-rose-900 rounded-lg border border-rose-100 text-sm">
              <span className="font-medium flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Critical Risks</span>
              </span>
              <span className="font-bold">{riskCounts.critical}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-900 rounded-lg border border-amber-100 text-sm">
              <span className="font-medium flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Attention Needed</span>
              </span>
              <span className="font-bold">{riskCounts.attention}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 text-sm">
              <span className="font-medium flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Informational Items</span>
              </span>
              <span className="font-bold">{riskCounts.informational}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Fields Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-semibold text-slate-900 mb-4">Extracted Structured Terms</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Term / Field</th>
                <th className="px-4 py-3">Extracted Value</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {analysis.extractedFields.map((field, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{field.field}</td>
                  <td className="px-4 py-3 text-slate-600">{field.value}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      field.status === 'found' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      field.status === 'uncertain' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="capitalize">{field.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
