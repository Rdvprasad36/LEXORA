/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, FileText, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenArchitecture: () => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenArchitecture, hasAnalysis }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-neutral-900 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button onClick={onReset} className="flex items-center gap-2.5 text-left group focus:outline-none">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-sm group-hover:bg-neutral-800 transition-colors">
            <ScaleIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 font-serif">Lexora</span>
            <span className="block text-[11px] text-neutral-500 font-medium tracking-wide">Legal Document Navigator</span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
        <button onClick={onReset} className="hover:text-neutral-900 transition-colors">
          Navigator
        </button>
        {hasAnalysis && (
          <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-medium border border-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Analysis Active
          </span>
        )}
        <button onClick={onOpenArchitecture} className="hover:text-neutral-900 transition-colors flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-neutral-500" />
          Architecture & Docs
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenArchitecture}
          className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          How It Works
        </button>
        {hasAnalysis && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            New Analysis
          </button>
        )}
      </div>
    </header>
  );
};

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-4 2 3 5 4 7 4h2" />
    </svg>
  );
}
