import React from 'react';
import { ShieldCheck, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">LEXORA</span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right max-w-xl">
            LEXORA provides AI-powered document intelligence and informational analysis. It is not a law firm and does not provide formal legal counsel. Always consult a licensed attorney.
          </p>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} LEXORA Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
            <span>API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
