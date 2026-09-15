import React from 'react';
import { Scale, ShieldCheck } from 'lucide-react';
import { ApiConfig } from '../types';

interface NavbarProps {
  onOpenConfig: () => void;
  config: ApiConfig;
  onNavigateHome: () => void;
  activeView: 'home' | 'dashboard' | 'workspace';
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConfig, config, onNavigateHome, activeView }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">LEXORA</span>
              <span className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                Legal AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Legal Intelligence & Document Reasoning Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">Firebase Secure Cloud</span>
          </div>
        </div>
      </div>
    </header>
  );
};

