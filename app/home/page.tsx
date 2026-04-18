'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, BookOpen, PlusSquare } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageTransition from '@/components/layout/PageTransition';
import SetCard from '@/components/home/SetCard';
import StatsBar from '@/components/home/StatsBar';
import EmptyState from '@/components/home/EmptyState';
import Button, { buttonClass } from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useSets } from '@/hooks/useSets';
import { deleteSet } from '@/lib/firebase/firestore';
import { useToast } from '@/context/ToastContext';

export default function HomePage() {
  const { user } = useAuth();
  const { sets, loading } = useSets(user?.uid ?? null);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalCards = sets.reduce((s, set) => s + set.cardCount, 0);
  const avgProgress =
    sets.length > 0
      ? Math.round(sets.reduce((s, set) => s + set.progressPercent, 0) / sets.length)
      : 0;

  const firstName = user?.displayName?.split(' ')[0] ?? 'Lernender';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  async function confirmDelete() {
    if (!user || !deleteId) return;
    setDeleting(true);
    try {
      await deleteSet(user.uid, deleteId);
      toast('Set gelöscht', 'success');
    } catch {
      toast('Fehler beim Löschen', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white"
              >
                {greeting}, {firstName} 👋
              </motion.h1>
              <p className="text-slate-400 text-sm mt-1">
                {sets.length > 0
                  ? `Du hast ${sets.length} Lernset${sets.length !== 1 ? 's' : ''} mit ${totalCards} Karten.`
                  : 'Erstelle dein erstes Lernset und leg los.'}
              </p>
            </div>
            <Link href="/create" className={`${buttonClass('primary', 'md')} flex-shrink-0`}>
              <Plus size={16} />
              Neues Set
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" className="text-violet-400" />
            </div>
          ) : sets.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Stats */}
              <StatsBar totalSets={sets.length} totalCards={totalCards} avgProgress={avgProgress} />

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <Link
                  href="/learn"
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">Lernen starten</div>
                    <div className="text-xs text-slate-500">Set auswählen & üben</div>
                  </div>
                </Link>
                <Link
                  href="/create"
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <PlusSquare size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">Set erstellen</div>
                    <div className="text-xs text-slate-500">Neue Karten anlegen</div>
                  </div>
                </Link>
              </div>

              {/* Sets grid */}
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Deine Sets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {sets.map((set) => (
                      <SetCard key={set.id} set={set} onDelete={(id) => setDeleteId(id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete confirmation modal */}
        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Set löschen">
          <p className="text-slate-300 text-sm mb-6">
            Möchtest du dieses Lernset wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Abbrechen
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={deleting}>
              Löschen
            </Button>
          </div>
        </Modal>
      </PageTransition>
    </AppShell>
  );
}
