import React, { useState, useEffect } from 'react';
import { DocumentRecord, ApiConfig } from './types';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { Dashboard } from './components/Dashboard';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { ApiConfigModal } from './components/ApiConfigModal';
import { Footer } from './components/Footer';

export default function App() {
  const [view, setView] = useState<'home' | 'dashboard' | 'workspace'>('home');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<ApiConfig>({
    geminiApiKey: '',
    dbProvider: 'supabase',
    supabaseUrl: '',
    supabaseKey: '',
  });

  useEffect(() => {
    // Fetch initial documents & config
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDocuments(data);
          if (data.length > 0 && !selectedDoc) {
            // Auto-select first document if available
            fetch(`/api/documents/${data[0].id}`)
              .then(r => r.json())
              .then(doc => setSelectedDoc(doc));
          }
        }
      })
      .catch(err => console.error('Failed to load documents:', err));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(prev => ({
          ...prev,
          dbProvider: data.dbProvider || 'firebase'
        }));
      })
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const handleUploadSuccess = (newDoc: DocumentRecord) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
    setView('workspace');
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
          setView('dashboard');
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleLoadSample = async () => {
    // Fetch sample document from server
    try {
      const res = await fetch('/api/documents/sample-doc-001');
      if (res.ok) {
        const doc = await res.json();
        setSelectedDoc(doc);
        if (!documents.some(d => d.id === doc.id)) {
          setDocuments(prev => [doc, ...prev]);
        }
        setView('workspace');
      }
    } catch (err) {
      console.error('Sample load error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar
        onOpenConfig={() => setIsConfigOpen(true)}
        config={config}
        onNavigateHome={() => setView('home')}
        activeView={view}
      />

      <main className="flex-1">
        {view === 'home' && (
          <>
            <LandingHero
              onStart={() => setView('dashboard')}
              onOpenSample={handleLoadSample}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <Dashboard
                documents={documents}
                onSelectDocument={(doc) => {
                  setSelectedDoc(doc);
                  setView('workspace');
                }}
                onUploadSuccess={handleUploadSuccess}
                onDeleteDocument={handleDeleteDocument}
                onLoadSample={handleLoadSample}
              />
            </div>
          </>
        )}

        {view === 'dashboard' && (
          <Dashboard
            documents={documents}
            onSelectDocument={(doc) => {
              setSelectedDoc(doc);
              setView('workspace');
            }}
            onUploadSuccess={handleUploadSuccess}
            onDeleteDocument={handleDeleteDocument}
            onLoadSample={handleLoadSample}
          />
        )}

        {view === 'workspace' && selectedDoc && (
          <DocumentWorkspace
            document={selectedDoc}
            allDocuments={documents}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>

      <Footer />

      <ApiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={(newCfg) => setConfig(newCfg)}
      />
    </div>
  );
};
