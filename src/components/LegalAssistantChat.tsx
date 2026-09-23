/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { sendLegalChat } from '../lib/api';

interface LegalAssistantChatProps {
  documentContext: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const LegalAssistantChat: React.FC<LegalAssistantChatProps> = ({ documentContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am your Lexora Legal Assistant. Ask me any specific question about clauses, obligations, penalties, or contingencies in this document. Note: This provides informational analysis only and does not constitute formal legal advice.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const answer = await sendLegalChat(
        userMsg,
        documentContext,
        newHistory.map(m => ({ role: m.role, content: m.content }))
      );
      setMessages([...newHistory, { role: 'model', content: answer }]);
    } catch (err: any) {
      setMessages([
        ...newHistory,
        { role: 'model', content: 'Sorry, I encountered an error communicating with the legal assistant. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-[550px]">
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-900">Lexora Q&A Assistant</h3>
            <span className="text-[11px] text-neutral-500">Ask questions grounded in this document</span>
          </div>
        </div>
        <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
          Informational Only
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-neutral-900 text-white rounded-tr-none'
                : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200/60'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-center text-neutral-400 text-xs italic">
            <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            <span>Lexora is searching document clauses...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-neutral-200 bg-neutral-50/50 rounded-b-2xl flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about termination, liability, or obligations..."
          className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
