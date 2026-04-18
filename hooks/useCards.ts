import { useEffect, useState } from 'react';
import { getCards } from '@/lib/firebase/firestore';
import type { Card } from '@/types/flashcard';

export function useCards(uid: string | null, setId: string | null) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid || !setId) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getCards(uid, setId)
      .then(setCards)
      .finally(() => setLoading(false));
  }, [uid, setId]);

  return { cards, setCards, loading };
}
