'use client';

import { useReducer } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Card, SessionState, SessionAction } from '@/types/flashcard';
import FlashCard from './FlashCard';
import AnswerButtons from './AnswerButtons';
import LearnProgressBar from './LearnProgressBar';
import SessionEndScreen from './SessionEndScreen';

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'FLIP':
      return { ...state, isFlipped: !state.isFlipped };
    case 'MARK_CORRECT': {
      const next = state.currentIndex + 1;
      return {
        ...state,
        correct: [...state.correct, state.cards[state.currentIndex]],
        currentIndex: next,
        isFlipped: false,
        isComplete: next >= state.cards.length,
      };
    }
    case 'MARK_INCORRECT': {
      const next = state.currentIndex + 1;
      return {
        ...state,
        incorrect: [...state.incorrect, state.cards[state.currentIndex]],
        currentIndex: next,
        isFlipped: false,
        isComplete: next >= state.cards.length,
      };
    }
    case 'REDO_WRONG':
      return {
        cards: action.cards,
        currentIndex: 0,
        isFlipped: false,
        correct: [],
        incorrect: [],
        isComplete: false,
      };
    case 'RESET':
      return {
        cards: action.cards,
        currentIndex: 0,
        isFlipped: false,
        correct: [],
        incorrect: [],
        isComplete: false,
      };
    default:
      return state;
  }
}

interface FlashcardDeckProps {
  cards: Card[];
  setId: string;
  onProgressSave: (correct: string[], incorrect: string[]) => void;
}

export default function FlashcardDeck({ cards, setId, onProgressSave }: FlashcardDeckProps) {
  const [state, dispatch] = useReducer(sessionReducer, {
    cards,
    currentIndex: 0,
    isFlipped: false,
    correct: [],
    incorrect: [],
    isComplete: false,
  });

  function handleCorrect() {
    const isLast = state.currentIndex + 1 >= state.cards.length;
    const newCorrect = [...state.correct, state.cards[state.currentIndex]];
    const newIncorrect = [...state.incorrect];
    if (isLast) {
      onProgressSave(
        newCorrect.map((c) => c.id),
        newIncorrect.map((c) => c.id)
      );
    }
    dispatch({ type: 'MARK_CORRECT' });
  }

  function handleIncorrect() {
    const isLast = state.currentIndex + 1 >= state.cards.length;
    const newIncorrect = [...state.incorrect, state.cards[state.currentIndex]];
    const newCorrect = [...state.correct];
    if (isLast) {
      onProgressSave(
        newCorrect.map((c) => c.id),
        newIncorrect.map((c) => c.id)
      );
    }
    dispatch({ type: 'MARK_INCORRECT' });
  }

  if (state.isComplete) {
    return (
      <SessionEndScreen
        totalCards={cards.length}
        correct={state.correct}
        incorrect={state.incorrect}
        onRedoWrong={() => dispatch({ type: 'REDO_WRONG', cards: state.incorrect })}
        setId={setId}
      />
    );
  }

  const currentCard = state.cards[state.currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <LearnProgressBar
        current={state.currentIndex + 1}
        total={state.cards.length}
        correct={state.correct.length}
        incorrect={state.incorrect.length}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id + state.currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <FlashCard
            card={currentCard}
            isFlipped={state.isFlipped}
            onFlip={() => dispatch({ type: 'FLIP' })}
          />
        </motion.div>
      </AnimatePresence>

      <AnswerButtons
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        disabled={!state.isFlipped}
      />
    </div>
  );
}
