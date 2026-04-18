'use client';

import { Menu, GraduationCap } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <GraduationCap size={14} className="text-white" />
        </div>
        <span className="font-bold text-white">Kartei<span className="text-violet-400">AI</span></span>
      </div>
    </header>
  );
}
