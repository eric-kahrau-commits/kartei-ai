'use client';

import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useDictation } from '@/hooks/useDictation';

interface DictationToolbarProps {
  activeRef: React.RefObject<HTMLDivElement | null>;
}

export default function DictationToolbar({ activeRef }: DictationToolbarProps) {
  const { isListening, isSupported, start, stop } = useDictation(activeRef);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-500">
        <AlertCircle size={12} />
        Diktierfunktion nur in Chrome/Edge verfügbar
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 border-t border-slate-800">
      <button
        type="button"
        onClick={isListening ? stop : start}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
          isListening
            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
        )}
      >
        <div className="relative">
          {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </div>
        {isListening ? 'Stopp' : 'Diktieren'}
      </button>
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="flex items-center gap-1.5 text-xs text-rose-400"
          >
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-rose-400 animate-bounce"
                  style={{ height: 12, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            Zuhören…
          </motion.div>
        )}
      </AnimatePresence>
      <span className="ml-auto text-xs text-slate-500">Klicke ins Textfeld, dann diktiere</span>
    </div>
  );
}
