import React, { useState } from 'react';
import { Upload, FileText, Trash2, ArrowRight, ShieldAlert, Sparkles, PlusCircle, Search } from 'lucide-react';
import { DocumentRecord } from '../types';

interface DashboardProps {
  documents: DocumentRecord[];
  onSelectDocument: (doc: DocumentRecord) => void;
  onUploadSuccess: (newDoc: DocumentRecord) => void;
  onDeleteDocument: (id: string) => void;
  onLoadSample: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onSelectDocument,
  onUploadSuccess,
  onDeleteDocument,
  onLoadSample,
}) => {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onUploadSuccess(data);
        onSelectDocument(data);
      } else {
        alert('Upload failed. Please check file size and format.');
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter(d =>
    d.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.analysis?.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Workspace</h1>
          <p className="text-sm text-slate-500">Upload and analyze contracts, agreements, and legal documents.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors border border-slate-300"
          >
            Load Sample Contract
          </button>
          
          <label className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium cursor-pointer shadow-md transition-all">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Analyzing...' : 'Upload Document'}</span>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" className="hidden" />
          </label>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) await uploadFile(file);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center mb-10 transition-all ${
          dragOver ? 'border-amber-500 bg-amber-50/50' : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-700">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Drag and drop your legal documents here</h3>
        <p className="text-xs text-slate-500 mb-4">Supports PDF, DOCX, and TXT up to 15MB with OCR fallback</p>
        <label className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-800">
          Browse Files
          <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" className="hidden" />
        </label>
      </div>

      {/* Search and List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search uploaded documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-hidden text-slate-800"
            />
          </div>
          <span className="text-xs font-medium text-slate-500">{filteredDocs.length} Documents</span>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No documents found</p>
              <p className="text-xs text-slate-400 mt-1">Upload a contract or load the sample to begin reasoning.</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/80 transition-colors gap-4"
              >
                <div className="flex items-start space-x-4 cursor-pointer" onClick={() => onSelectDocument(doc)}>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 hover:text-amber-700 transition-colors">
                      {doc.filename}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span>{doc.analysis?.documentType || 'Contract'}</span>
                      <span>•</span>
                      <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                    Analyzed
                  </span>

                  <button
                    onClick={() => onSelectDocument(doc)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
