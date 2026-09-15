import React, { useState } from 'react';
import { DocumentRecord, ChatMessage } from '../types';
import { Send, Sparkles, HelpCircle, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

interface QATabProps {
  document: DocumentRecord;
}

export const QATab: React.FC<QATabProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello! I am LEXORA. I have analyzed "${document.filename}". You can ask me any question regarding payment terms, termination conditions, liability, or obligations. All answers are grounded directly in this document.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const starterQuestions = [
    "What are the payment terms and late fees?",
    "How can either party terminate this agreement?",
    "What are my intellectual property obligations?",
    "Are there any non-compete restrictions?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch(`/api/documents/${document.id}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: data.answer,
        confidence: data.confidence,
        unsupported: data.unsupported,
        evidence: data.evidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Q&A error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Evidence-Grounded Document Q&A</h3>
        <p className="text-sm text-slate-500">Ask questions and receive answers cited directly from the document source text.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[600px]">
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-amber-600" />
                      <span>Verifying Source Citation</span>
                    </span>
                    {msg.evidence.map((ev, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 italic">
                        "{ev.quote}"
                      </div>
                    ))}
                  </div>
                )}

                {msg.confidence !== undefined && (
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/40">
                    <span>Confidence: {Math.round(msg.confidence * 100)}%</span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-3">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>LEXORA is retrieving document evidence...</span>
            </div>
          )}
        </div>

        {/* Starter Prompts */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Suggested:</span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3"
        >
          <input
            type="text"
            placeholder="Ask anything about this document..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
