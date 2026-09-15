import React from 'react';
import { Scale, ShieldCheck, FileSearch, ArrowRight, Upload, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
  onOpenSample: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart, onOpenSample }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence-Grounded Legal Reasoning & Risk Triage</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Understand your document <br />
          <span className="text-amber-400">before you act.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          LEXORA analyzes contracts, leases, and agreements with citation-backed precision. Every insight is traceable to exact source passages, keeping you informed without replacing legal counsel.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg hover:bg-amber-300 transition-all text-base"
          >
            <span>Launch Document Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOpenSample}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all text-base"
          >
            <FileSearch className="w-5 h-5 text-amber-400" />
            <span>Load Sample Contract Analysis</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-700/80 pt-12">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Verifiable Citations</h3>
            <p className="text-sm text-slate-400">
              100% of substantive AI answers are grounded in retrieved source text with direct click-to-source citation chips.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tiered Risk Triage</h3>
            <p className="text-sm text-slate-400">
              Structured risk assessment across 4 severity tiers with explanations, consequences, and action recommendations.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60">
            <div className="w-10 h-10 rounded-lg bg-indigo-400/10 flex items-center justify-center text-indigo-400 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Lawyer Preparation</h3>
            <p className="text-sm text-slate-400">
              Generate focused questions and review checklists to maximize efficiency during professional legal consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
