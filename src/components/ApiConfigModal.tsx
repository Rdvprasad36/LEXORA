import React, { useState, useEffect } from 'react';
import { X, Key, Database, ShieldCheck, Check } from 'lucide-react';
import { ApiConfig } from '../types';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (newConfig: ApiConfig) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [formData, setFormData] = useState<ApiConfig>(config);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      onSave(formData);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to save config', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">LEXORA System & API Configuration</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={formData.geminiApiKey}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Used securely on the server for clause analysis, risk assessment, and evidence-grounded Q&A.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cloud Database Backend (Supabase / Firebase)
            </label>
            <select
              value={formData.dbProvider}
              onChange={(e) => setFormData({ ...formData, dbProvider: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden text-sm mb-3"
            >
              <option value="supabase">Supabase (PostgreSQL + pgvector)</option>
              <option value="firebase">Firebase Firestore</option>
              <option value="internal">Secure Internal Cloud Storage</option>
            </select>

            {formData.dbProvider === 'supabase' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Supabase Project URL (https://xyz.supabase.co)"
                  value={formData.supabaseUrl || ''}
                  onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <input
                  type="password"
                  placeholder="Supabase Anon / Service Role Key"
                  value={formData.supabaseKey || ''}
                  onChange={(e) => setFormData({ ...formData, supabaseKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-3 border border-slate-200">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs text-slate-600">
              LEXORA strictly enforces object-level authorization, prompt-injection isolation, and encryption in transit.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
