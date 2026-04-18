'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, RotateCcw, Trophy, Target } from 'lucide-react';
import Button from '@/components/ui/Button';
import { buttonClass } from '@/components/ui/Button';
import type { Card } from '@/types/flashcard';

interface SessionEndScreenProps {
  totalCards: number;
  correct: Card[];
  incorrect: Card[];
  onRedoWrong: () => void;
  setId: string;
}

export default function SessionEndScreen({
  totalCards,
  correct,
  incorrect,
  onRedoWrong,
  setId,
}: SessionEndScreenProps) {
  const percent = totalCards > 0 ? Math.round((correct.length / totalCards) * 100) : 0;
  const isGreat = percent >= 80;
  const isOk = percent >= 50;

  const emoji = isGreat ? '🎉' : isOk ? '👍' : '💪';
  const message = isGreat
    ? 'Hervorragend! Du hast das sehr gut gemeistert!'
    : isOk
    ? 'Gut gemacht! Noch etwas üben und du schaffst es!'
    : 'Weiter üben! Du wirst besser!';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center max-w-md mx-auto py-12 px-4"
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-2xl font-bold text-white mb-2">Sitzung abgeschlossen!</h2>
      <p className="text-slate-400 text-sm mb-8">{message}</p>

      {/* Circular progress */}
      <div className="relative w-36 h-36 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={isGreat ? '#10b981' : isOk ? '#f59e0b' : '#f43f5e'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - percent / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{percent}%</span>
          <span className="text-xs text-slate-400">richtig</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Richtig</span>
          </div>
          <div className="text-2xl font-bold text-white">{correct.length}</div>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-rose-400" />
            <span className="text-xs text-rose-400 font-medium">Falsch</span>
          </div>
          <div className="text-2xl font-bold text-white">{incorrect.length}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {incorrect.length > 0 && (
          <Button variant="primary" className="flex-1" onClick={onRedoWrong}>
            <RotateCcw size={16} />
            Falsche üben ({incorrect.length})
          </Button>
        )}
        <Link href="/home" className={buttonClass('secondary', 'md', 'flex-1')}>
          <Home size={16} />
          Zurück zur Übersicht
        </Link>
      </div>
    </motion.div>
  );
}
