/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, FileText, Sparkles, ShieldAlert, CheckCircle, ArrowRight, BookOpen, AlertCircle, Building2, User } from 'lucide-react';
import { DEMO_CONTEXTS, DemoContext } from '../lib/demoData';
import { parseUploadedFile } from '../lib/documentParser';
import { analyzeLegalDocument } from '../lib/api';
import { LegalAnalysisResult } from '../lib/schema';

interface HeroLandingProps {
  onAnalysisComplete: (analysis: LegalAnalysisResult, rawText: string, title: string) => void;
  onOpenArchitecture: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onAnalysisComplete, onOpenArchitecture }) => {
  const [selectedDemo, setSelectedDemo] = useState<DemoContext | null>(DEMO_CONTEXTS[0]);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string>(DEMO_CONTEXTS[0].role);
  const [concern, setConcern] = useState<string>(DEMO_CONTEXTS[0].concern);
  const [jurisdiction, setJurisdiction] = useState<string>('US Federal / General Contract Law');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'upload'>('demo');

  const handleDemoSelect = (demo: DemoContext) => {
    setSelectedDemo(demo);
    setRole(demo.role);
    setConcern(demo.concern);
    setCustomFile(null);
    setCustomText('');
    setImageBase64(undefined);
    setImageMimeType(undefined);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomFile(file);
    setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
    setSelectedDemo(null);
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseUploadedFile(file);
      setCustomText(parsed.text);
      if (parsed.isImage) {
        setImageBase64(parsed.imageBase64);
        setImageMimeType(parsed.imageMimeType);
      } else {
        setImageBase64(undefined);
        setImageMimeType(undefined);
      }
    } catch (err: any) {
      setError('Could not parse document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      let docText = '';
      let docTitle = '';

      if (activeTab === 'demo' && selectedDemo) {
        docText = selectedDemo.documentText;
        docTitle = selectedDemo.title;
        try {
          const result = await analyzeLegalDocument({
            documentText: docText,
            role,
            concern,
            documentTitle: docTitle,
            jurisdiction,
          });
          onAnalysisComplete(result, docText, docTitle);
          return;
        } catch {
          onAnalysisComplete(selectedDemo.analysis, docText, docTitle);
          return;
        }
      } else {
        if (!customText && !customFile && !imageBase64) {
          throw new Error('Please upload a legal document, image, or select a demo.');
        }
        docText = customText || await customFile?.text() || '';
        docTitle = customTitle || customFile?.name || 'Uploaded Legal Document';

        const result = await analyzeLegalDocument({
          documentText: docText,
          role,
          concern,
          documentTitle: docTitle,
          imageBase64,
          imageMimeType,
          jurisdiction,
        });
        onAnalysisComplete(result, docText, docTitle);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check your document and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gemini AI · Native PDF Vision & Deterministic Evidence Verification</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 font-serif mb-6 leading-tight">
          Navigate legal complexity with absolute clarity & verifiable proof.
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-8">
          Upload a legal agreement, declare your role and concern, and Lexora analyzes risks, highlights obligations, and verifies every claim directly against document text.
        </p>
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden mb-16">
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/70 p-2 gap-2">
          <button
            onClick={() => { setActiveTab('demo'); setSelectedDemo(DEMO_CONTEXTS[0]); setRole(DEMO_CONTEXTS[0].role); setConcern(DEMO_CONTEXTS[0].concern); }}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'demo' ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            Explore Prepared Demos (Instant)
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setSelectedDemo(null); }}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload' ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            Upload Legal PDF
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'demo' ? (
            <div className="space-y-6">
              <label className="block text-sm font-semibold text-neutral-900">
                Select a Prepared Legal Case Study:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_CONTEXTS.map((demo) => {
                  const isSelected = selectedDemo?.id === demo.id;
                  return (
                    <div
                      key={demo.id}
                      onClick={() => handleDemoSelect(demo)}
                      className={`p-5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-neutral-800 text-amber-300' : 'bg-neutral-100 text-neutral-700'}`}>
                          {demo.documentType}
                        </span>
                        <Building2 className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`} />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{demo.title}</h3>
                      <div className={`text-xs space-y-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        <p><strong>Role:</strong> {demo.role}</p>
                        <p><strong>Focus:</strong> {demo.concern}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <label className="block text-sm font-semibold text-neutral-900">
                Upload Commercial Lease, NDA, Contract, Policy, Word, PDF or Image:
              </label>
              <div className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-2xl p-8 text-center bg-neutral-50/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-base font-semibold text-neutral-900 mb-1">
                    {customFile ? customFile.name : 'Click to browse or drag & drop PDF, Word (.docx), Image, or TXT'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    PDF, Word (.docx), PNG, JPG, TXT up to 25MB · Ephemeral processing
                  </span>
                </label>
              </div>
              {customFile && (
                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  <span>Successfully loaded: <strong>{customFile.name}</strong> ({Math.round(customFile.size / 1024)} KB)</span>
                </div>
              )}
            </div>
          )}

          {/* Role and Concern Configuration */}
          <div className="mt-8 pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Declare Your Legal Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Small Business Tenant, Landlord, Employee, Founder"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Primary Concern or Objective
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldAlert className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="e.g. Financial Exposure, Termination Rights, Liability"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Legal Jurisdiction / Regulatory Framework
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
            >
              <option value="US Federal / General Contract Law">US Federal / General Contract Law</option>
              <option value="California (CCPA / Employment & Labor Standards)">California (CCPA / Employment & Labor Standards)</option>
              <option value="Delaware Corporate Law">Delaware Corporate Law</option>
              <option value="New York Commercial Law">New York Commercial Law</option>
              <option value="European Union (GDPR & Consumer Rights)">European Union (GDPR & Consumer Rights)</option>
              <option value="United Kingdom (UK Commercial & Employment)">United Kingdom (UK Commercial & Employment)</option>
            </select>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              <span>🔒 Zero database persistence · Ephemeral session security</span>
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={loading || (activeTab === 'upload' && !customText && !customFile)}
              className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Document & Verifying Evidence...</span>
                </>
              ) : (
                <>
                  <span>Run Lexora Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Footer Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 mb-1">Dual Pipeline Architecture</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">Gemini legal analysis runs independently from client-side deterministic text verification.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 mb-1">Computed Evidence Status</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">Every claim is verified against actual document text. Unverified claims are honestly labeled.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 mb-1">Professional Preparation</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">Generates precise questions and checklists to prepare you for a qualified legal professional.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
