import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  getFirestore,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseApp } from './config';
import type { FlashcardSet, Card, StudyProgress } from '@/types/flashcard';

function db() {
  return getFirestore(getFirebaseApp());
}

// --- Sets ---

export function subscribeSets(uid: string, onData: (sets: FlashcardSet[]) => void): Unsubscribe {
  const q = query(collection(db(), `users/${uid}/sets`), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const sets = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FlashcardSet));
    onData(sets);
  });
}

export async function getSet(uid: string, setId: string): Promise<FlashcardSet | null> {
  const snap = await getDoc(doc(db(), `users/${uid}/sets/${setId}`));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FlashcardSet;
}

export async function createSet(uid: string, title: string): Promise<string> {
  const ref = doc(collection(db(), `users/${uid}/sets`));
  await setDoc(ref, {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    cardCount: 0,
    progressPercent: 0,
    lastStudied: null,
    coverColor: randomCoverColor(),
  });
  return ref.id;
}

export async function updateSetMeta(uid: string, setId: string, data: Partial<FlashcardSet>) {
  await updateDoc(doc(db(), `users/${uid}/sets/${setId}`), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSet(uid: string, setId: string) {
  const cardsSnap = await getDocs(collection(db(), `users/${uid}/sets/${setId}/cards`));
  const batch = writeBatch(db());
  cardsSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db(), `users/${uid}/sets/${setId}`));
  await batch.commit();
}

// --- Cards ---

export async function getCards(uid: string, setId: string): Promise<Card[]> {
  const snap = await getDocs(
    query(collection(db(), `users/${uid}/sets/${setId}/cards`), orderBy('order', 'asc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Card));
}

export async function saveCards(uid: string, setId: string, cards: Card[]) {
  const database = db();
  const batch = writeBatch(database);

  const existing = await getDocs(collection(database, `users/${uid}/sets/${setId}/cards`));
  existing.docs.forEach((d) => batch.delete(d.ref));

  cards.forEach((card) => {
    const ref = doc(database, `users/${uid}/sets/${setId}/cards/${card.id}`);
    batch.set(ref, card);
  });

  batch.update(doc(database, `users/${uid}/sets/${setId}`), {
    cardCount: cards.length,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

// --- Progress ---

export async function getProgress(uid: string, setId: string): Promise<StudyProgress | null> {
  const snap = await getDoc(doc(db(), `users/${uid}/progress/${setId}`));
  if (!snap.exists()) return null;
  return snap.data() as StudyProgress;
}

export async function saveProgress(
  uid: string,
  setId: string,
  correct: string[],
  incorrect: string[],
  totalCards: number
) {
  const percent = totalCards > 0 ? Math.round((correct.length / totalCards) * 100) : 0;
  const database = db();
  const batch = writeBatch(database);

  batch.set(doc(database, `users/${uid}/progress/${setId}`), {
    setId,
    correctCards: correct,
    incorrectCards: incorrect,
    lastStudied: serverTimestamp(),
    totalSessions: 1,
  });

  batch.update(doc(database, `users/${uid}/sets/${setId}`), {
    progressPercent: percent,
    lastStudied: serverTimestamp(),
  });

  await batch.commit();
}

// --- Helpers ---

const COVER_COLORS = [
  '#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706',
  '#0891B2', '#9333EA', '#16A34A', '#EA580C', '#BE185D',
];

function randomCoverColor(): string {
  return COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
}
