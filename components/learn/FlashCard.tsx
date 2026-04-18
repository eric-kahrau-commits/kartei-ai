'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Card } from '@/types/flashcard';
import CardFace from './CardFace';
import { RotateCw } from 'lucide-react';

interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

const FLIP_OUT = { rotateY: 90,  opacity: 0, transition: { duration: 0.18, ease: 'easeIn'  } };
const FLIP_IN  = { rotateY: 0,   opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } };

export default function FlashCard({ card, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={FLIP_IN}
            exit={FLIP_OUT}
            className="w-full rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="relative pt-10 pb-10">
              <div className="absolute top-4 left-4 text-xs font-semibold text-violet-400 uppercase tracking-wider opacity-70">
                Frage
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 text-slate-500 text-xs">
                <RotateCw size={12} />
                Klicken zum Umdrehen
              </div>
              <CardFace text={card.frontText} imageUrl={card.frontImageUrl} side="front" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={FLIP_IN}
            exit={{ ...FLIP_OUT, rotateY: -90 }}
            className="w-full rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-800/50 shadow-2xl overflow-hidden"
          >
            <div className="relative pt-10 pb-10">
              <div className="absolute top-4 left-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider opacity-70">
                Antwort
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 text-slate-500 text-xs">
                <RotateCw size={12} />
                Klicken zum Umdrehen
              </div>
              <CardFace text={card.backText} imageUrl={card.backImageUrl} side="back" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
