'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, RefreshCw } from 'lucide-react';
import type { Card } from '@/types/flashcard';
import AiLoadingState from './AiLoadingState';

type Length = 'kurz' | 'mittel' | 'lang';

const LENGTH_OPTIONS: { value: Length; label: string; desc: string }[] = [
  { value: 'kurz',   label: 'Kurz',    desc: '~200 Wörter' },
  { value: 'mittel', label: 'Mittel',  desc: '~400 Wörter' },
  { value: 'lang',   label: 'Lang',    desc: '~700 Wörter' },
];

interface AiOverviewProps {
  cards: Card[];
  setTitle: string;
  onBack: () => void;
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-6 mb-3 flex items-center gap-2"><span class="w-1.5 h-5 rounded-full bg-cyan-400 inline-block"></span>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-2 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-300">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 py-0.5"><span class="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-2"></span><span>$1</span></li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 py-0.5 ml-4 list-decimal">$1</li>')
    .replace(/(<li .+<\/li>\n?)+/g, (m) => `<ul class="space-y-1 my-3">${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p class="text-slate-300 leading-relaxed my-2">')
    .replace(/^([^<].+)$/gm, (line) =>
      line.trim() ? `<p class="text-slate-300 leading-relaxed my-2">${line}</p>` : ''
    );
}

export default function AiOverview({ cards, setTitle, onBack }: AiOverviewProps) {
  const [length, setLength] = useState<Length>('mittel');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setContent('');
    setError('');

    fetch('/api/ai-overview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setTitle,
        length,
        cards: cards.map((c) => ({
          front: c.frontText.replace(/<[^>]+>/g, ''),
          back: c.backText.replace(/<[^>]+>/g, ''),
        })),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setContent(data.content);
      })
      .catch(() => {
        if (!cancelled) setError('Verbindungsfehler. Bitte erneut versuchen.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [cards, setTitle, fetchKey]);

  function handleLengthChange(l: Length) {
    setLength(l);
    setFetchKey((k) => k + 1);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Zurück zur Modusauswahl
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KI-Lernübersicht</h1>
            <p className="text-slate-400 text-sm">{setTitle}</p>
          </div>
        </div>

        {/* Length selector */}
        <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 flex-shrink-0">
          {LENGTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => !loading && handleLengthChange(opt.value)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                length === opt.value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white disabled:cursor-not-allowed'
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <AiLoadingState />
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
          <p className="text-rose-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => setFetchKey((k) => k + 1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            Erneut versuchen
          </button>
        </div>
      ) : (
        <motion.div
          key={fetchKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8"
        >
          <div
            className="prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </motion.div>
      )}
    </div>
  );
}
