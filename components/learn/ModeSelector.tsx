'use client';

import { motion } from 'framer-motion';
import { CreditCard, Brain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ModeSelectorProps {
  setTitle: string;
  cardCount: number;
  onSelectMode: (mode: 'flashcards' | 'ai-overview') => void;
}

export default function ModeSelector({ setTitle, cardCount, onSelectMode }: ModeSelectorProps) {
  const modes = [
    {
      id: 'flashcards' as const,
      title: 'Karteikarten',
      description: 'Lerne mit klassischen Karteikarten. Drehe die Karte um und bewerte deine Antwort.',
      icon: CreditCard,
      gradient: 'from-violet-500 to-indigo-600',
      glow: 'shadow-violet-900/30',
    },
    {
      id: 'ai-overview' as const,
      title: 'KI-Übersicht',
      description: 'Lass die KI alle Inhalte zusammenfassen und strukturiert aufbereiten.',
      icon: Brain,
      gradient: 'from-indigo-500 to-cyan-600',
      glow: 'shadow-cyan-900/30',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Zurück
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">{setTitle}</h1>
        <p className="text-slate-400 text-sm">{cardCount} Karten · Wähle deinen Lernmodus</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modes.map(({ id, title, description, icon: Icon, gradient, glow }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(id)}
            className={`flex flex-col items-start p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all text-left shadow-xl ${glow}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <Icon size={22} className="text-white" />
            </div>
            <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
