import { Timestamp } from 'firebase/firestore';

export interface Card {
  id: string;
  frontText: string;
  backText: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  order: number;
}

export interface FlashcardSet {
  id: string;
  title: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  cardCount: number;
  progressPercent: number;
  lastStudied?: Timestamp | Date | null;
  coverColor?: string;
}

export interface StudyProgress {
  setId: string;
  correctCards: string[];
  incorrectCards: string[];
  lastStudied: Timestamp | Date;
  totalSessions: number;
}

export type SessionState = {
  cards: Card[];
  currentIndex: number;
  isFlipped: boolean;
  correct: Card[];
  incorrect: Card[];
  isComplete: boolean;
};

export type SessionAction =
  | { type: 'FLIP' }
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_INCORRECT' }
  | { type: 'REDO_WRONG'; cards: Card[] }
  | { type: 'RESET'; cards: Card[] };
