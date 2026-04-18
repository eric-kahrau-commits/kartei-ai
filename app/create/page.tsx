'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Plus, Save } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageTransition from '@/components/layout/PageTransition';
import SetTitleInput from '@/components/create/SetTitleInput';
import CardEditor from '@/components/create/CardEditor';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useImageUpload } from '@/hooks/useImageUpload';
import { createSet, saveCards } from '@/lib/firebase/firestore';
import { useToast } from '@/context/ToastContext';
import type { Card } from '@/types/flashcard';

function newCard(order: number): Card {
  return {
    id: Math.random().toString(36).slice(2),
    frontText: '',
    backText: '',
    order,
  };
}

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { upload, uploading: uploadingFile } = useImageUpload();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<Card[]>([newCard(0)]);
  const [saving, setSaving] = useState(false);
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i }));
    });
  }, []);

  const addCard = useCallback(() => {
    setCards((prev) => [...prev, newCard(prev.length)]);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  async function handleImageUpload(cardId: string, side: 'front' | 'back', file: File) {
    if (!user) return;
    const key = `${cardId}_${side}`;
    setUploadingMap((m) => ({ ...m, [key]: true }));
    try {
      const tempSetId = 'temp_' + user.uid;
      const url = await upload(user.uid, tempSetId, cardId, side, file);
      updateCard(cardId, side === 'front' ? { frontImageUrl: url } : { backImageUrl: url });
    } catch {
      toast('Bild-Upload fehlgeschlagen', 'error');
    } finally {
      setUploadingMap((m) => ({ ...m, [key]: false }));
    }
  }

  async function handleSave() {
    if (!user) return;
    if (!title.trim()) {
      toast('Bitte gib einen Titel ein', 'error');
      return;
    }
    const validCards = cards.filter((c) => c.frontText.trim() || c.backText.trim());
    if (validCards.length === 0) {
      toast('Füge mindestens eine Karte hinzu', 'error');
      return;
    }
    setSaving(true);
    try {
      const setId = await createSet(user.uid, title.trim());
      await saveCards(user.uid, setId, validCards.map((c, i) => ({ ...c, order: i })));
      toast('Set gespeichert!', 'success');
      router.push('/home');
    } catch {
      toast('Fehler beim Speichern', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="p-6 max-w-4xl mx-auto pb-24">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <SetTitleInput value={title} onChange={setTitle} />
            </div>
            <Button onClick={handleSave} isLoading={saving} className="flex-shrink-0 mt-2">
              <Save size={16} />
              Speichern
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {cards.map((card, index) => (
                <CardEditor
                  key={card.id}
                  card={card}
                  index={index}
                  onUpdate={updateCard}
                  onRemove={removeCard}
                  onFrontImageUpload={(id, file) => handleImageUpload(id, 'front', file)}
                  onBackImageUpload={(id, file) => handleImageUpload(id, 'back', file)}
                  onFrontImageRemove={(id) => updateCard(id, { frontImageUrl: undefined })}
                  onBackImageRemove={(id) => updateCard(id, { backImageUrl: undefined })}
                  uploading={uploadingMap}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="secondary" onClick={addCard} size="lg">
              <Plus size={18} />
              Neue Karte hinzufügen
            </Button>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
