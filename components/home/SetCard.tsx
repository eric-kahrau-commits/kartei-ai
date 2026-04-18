'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Pencil, Trash2, Clock } from 'lucide-react';
import type { FlashcardSet } from '@/types/flashcard';
import { getProgressColor } from '@/lib/utils/progressCalc';
import { Timestamp } from 'firebase/firestore';
import Badge from '@/components/ui/Badge';

interface SetCardProps {
  set: FlashcardSet;
  onDelete: (id: string) => void;
}

function formatDate(d: FlashcardSet['createdAt']) {
  if (!d) return '';
  const date = d instanceof Timestamp ? d.toDate() : new Date(d as Date);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SetCard({ set, onDelete }: SetCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group"
    >
      {/* Color band */}
      <div
        className="h-2"
        style={{ background: `linear-gradient(90deg, ${set.coverColor ?? '#7C3AED'}, ${set.coverColor ?? '#7C3AED'}88)` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-white text-base leading-tight line-clamp-2">{set.title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Link
              href={`/create/${set.id}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Pencil size={14} />
            </Link>
            <button
              onClick={() => onDelete(set.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge>{set.cardCount} Karten</Badge>
          {set.progressPercent > 0 && (
            <Badge
              variant={set.progressPercent >= 80 ? 'success' : set.progressPercent >= 50 ? 'warning' : 'danger'}
            >
              {set.progressPercent}%
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(set.progressPercent)}`}
            style={{ width: `${set.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={11} />
            {formatDate(set.updatedAt)}
          </div>
          <Link
            href={`/learn/${set.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
          >
            <BookOpen size={13} />
            Lernen
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
