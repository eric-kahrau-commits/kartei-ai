'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import PageTransition from '@/components/layout/PageTransition';
import ModeSelector from '@/components/learn/ModeSelector';
import FlashcardDeck from '@/components/learn/FlashcardDeck';
import AiOverview from '@/components/learn/AiOverview';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { getSet, getCards, saveProgress } from '@/lib/firebase/firestore';
import type { FlashcardSet, Card } from '@/types/flashcard';

type Mode = 'select' | 'flashcards' | 'ai-overview';

export default function LearnPage() {
  const params = useParams();
  const setId = params.id as string;
  const { user } = useAuth();

  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('select');

  useEffect(() => {
    if (!user || !setId) return;
    Promise.all([getSet(user.uid, setId), getCards(user.uid, setId)]).then(([setData, cardData]) => {
      setSet(setData);
      setCards(cardData);
      setLoading(false);
    });
  }, [user, setId]);

  async function handleProgressSave(correct: string[], incorrect: string[]) {
    if (!user) return;
    await saveProgress(user.uid, setId, correct, incorrect, cards.length);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" className="text-violet-400" />
        </div>
      </AppShell>
    );
  }

  if (!set) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full text-slate-400">
          Set nicht gefunden.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="overflow-auto h-full">
          {mode === 'select' && (
            <ModeSelector
              setTitle={set.title}
              cardCount={cards.length}
              onSelectMode={setMode}
            />
          )}
          {mode === 'flashcards' && (
            <FlashcardDeck
              cards={cards}
              setId={setId}
              onProgressSave={handleProgressSave}
            />
          )}
          {mode === 'ai-overview' && (
            <AiOverview
              cards={cards}
              setTitle={set.title}
              onBack={() => setMode('select')}
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
