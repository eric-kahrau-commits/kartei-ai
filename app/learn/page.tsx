'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Plus, Clock, CreditCard } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageTransition from '@/components/layout/PageTransition';
import Spinner from '@/components/ui/Spinner';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useSets } from '@/hooks/useSets';
import { getProgressColor } from '@/lib/utils/progressCalc';
import { Timestamp } from 'firebase/firestore';
import type { FlashcardSet } from '@/types/flashcard';

function formatDate(d: FlashcardSet['lastStudied']) {
  if (!d) return 'Noch nicht gelernt';
  const date = d instanceof Timestamp ? d.toDate() : new Date(d as Date);
  return 'Zuletzt: ' + date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

export default function LearnIndexPage() {
  const { user } = useAuth();
  const { sets, loading } = useSets(user?.uid ?? null);

  return (
    <AppShell>
      <PageTransition>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Lernen</h1>
            <p className="text-slate-400 text-sm">Wähle ein Set aus um zu starten</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" className="text-violet-400" />
            </div>
          ) : sets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-slate-500" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Noch keine Lernsets</h2>
              <p className="text-slate-400 text-sm mb-6">Erstelle zuerst ein Set auf der Erstellenseite.</p>
              <Link href="/create" className={buttonClass('primary', 'md')}>
                <Plus size={16} />
                Erstes Set erstellen
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sets.map((set, i) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/learn/${set.id}`}
                    className="block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-900/20 transition-all duration-200 group"
                  >
                    <div
                      className="h-1.5"
                      style={{ background: `linear-gradient(90deg, ${set.coverColor ?? '#7C3AED'}, ${set.coverColor ?? '#7C3AED'}88)` }}
                    />
                    <div className="p-5">
                      <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors">
                        {set.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><CreditCard size={11} />{set.cardCount} Karten</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{formatDate(set.lastStudied)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(set.progressPercent)}`}
                          style={{ width: `${set.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{set.progressPercent}% geschafft</span>
                        <span className="text-xs font-medium text-violet-400 group-hover:text-violet-300 flex items-center gap-1">
                          <BookOpen size={12} />
                          Starten →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
