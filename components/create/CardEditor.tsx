'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';
import type { Card } from '@/types/flashcard';
import CardSide from './CardSide';
import DictationToolbar from './DictationToolbar';

interface CardEditorProps {
  card: Card;
  index: number;
  onUpdate: (id: string, updates: Partial<Card>) => void;
  onRemove: (id: string) => void;
  onFrontImageUpload: (cardId: string, file: File) => Promise<void>;
  onBackImageUpload: (cardId: string, file: File) => Promise<void>;
  onFrontImageRemove: (cardId: string) => void;
  onBackImageRemove: (cardId: string) => void;
  uploading?: { [side: string]: boolean };
}

export default function CardEditor({
  card,
  index,
  onUpdate,
  onRemove,
  onFrontImageUpload,
  onBackImageUpload,
  onFrontImageRemove,
  onBackImageRemove,
  uploading,
}: CardEditorProps) {
  const globalActiveRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-slate-600 cursor-grab" />
          <span className="text-sm font-semibold text-slate-400">Karte {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(card.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Card sides */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
        <CardSide
          label="Vorderseite"
          text={card.frontText}
          imageUrl={card.frontImageUrl}
          onTextChange={(html) => onUpdate(card.id, { frontText: html })}
          onImageUpload={(file) => onFrontImageUpload(card.id, file)}
          onImageRemove={() => onFrontImageRemove(card.id)}
          uploading={uploading?.[`${card.id}_front`]}
          globalActiveRef={globalActiveRef}
        />
        <CardSide
          label="Rückseite"
          text={card.backText}
          imageUrl={card.backImageUrl}
          onTextChange={(html) => onUpdate(card.id, { backText: html })}
          onImageUpload={(file) => onBackImageUpload(card.id, file)}
          onImageRemove={() => onBackImageRemove(card.id)}
          uploading={uploading?.[`${card.id}_back`]}
          globalActiveRef={globalActiveRef}
        />
      </div>

      {/* Dictation bar scoped to this card */}
      <DictationToolbar activeRef={globalActiveRef} />
    </motion.div>
  );
}
