'use client';

import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnswerButtonsProps {
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled: boolean;
}

export default function AnswerButtons({ onCorrect, onIncorrect, disabled }: AnswerButtonsProps) {
  if (disabled) {
    return (
      <div className="flex gap-4 justify-center mt-6">
        <p className="text-sm text-slate-400 italic">Karte umdrehen, um die Antwort zu bewerten</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 justify-center mt-6"
    >
      <button
        onClick={onIncorrect}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 font-medium transition-all duration-150 active:scale-95 border border-rose-500/20 hover:border-rose-500/40"
      >
        <X size={18} />
        Falsch
      </button>
      <button
        onClick={onCorrect}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-medium transition-all duration-150 active:scale-95 border border-emerald-500/20 hover:border-emerald-500/40"
      >
        <Check size={18} />
        Richtig
      </button>
    </motion.div>
  );
}
