import { useEffect, useState } from 'react';
import { subscribeSets } from '@/lib/firebase/firestore';
import type { FlashcardSet } from '@/types/flashcard';

export function useSets(uid: string | null) {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setSets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeSets(uid, (data) => {
      setSets(data);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { sets, loading };
}
