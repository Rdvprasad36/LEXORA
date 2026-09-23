/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Search, Copy, Check, X } from 'lucide-react';

interface DocumentInspectorProps {
  documentTitle: string;
  documentText: string;
  highlightQuery?: string;
  onClose?: () => void;
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({ documentTitle, documentText, highlightQuery, onClose }) => {
  const [searchTerm, setSearchTerm] = useState(highlightQuery || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-[550px]">
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900">{documentTitle}</h3>
            <span className="text-[11px] text-neutral-500">Document Text & Evidence Viewer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 border-b border-neutral-200 bg-neutral-100/50 flex items-center gap-2">
        <Search className="w-4 h-4 text-neutral-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in document..."
          className="w-full bg-transparent text-xs text-neutral-800 focus:outline-none px-1"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50/30">
        {documentText}
      </div>
    </div>
  );
};
