'use client';

import { useRef, useEffect, useCallback } from 'react';
import RichTextToolbar from './RichTextToolbar';
import ImageUploadZone from './ImageUploadZone';
import { cn } from '@/lib/utils/cn';

interface CardSideProps {
  label: 'Vorderseite' | 'Rückseite';
  text: string;
  imageUrl?: string;
  onTextChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove: () => void;
  uploading?: boolean;
  globalActiveRef: React.MutableRefObject<HTMLDivElement | null>;
}

export default function CardSide({
  label,
  text,
  imageUrl,
  onTextChange,
  onImageUpload,
  onImageRemove,
  uploading,
  globalActiveRef,
}: CardSideProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerHTML !== text) el.innerHTML = text;
  }, [text]);

  const syncActiveRef = useCallback(() => {
    globalActiveRef.current = divRef.current;
  }, [globalActiveRef]);

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    if (isComposing.current) return;
    onTextChange((e.target as HTMLDivElement).innerHTML);
  }

  // Auto-format on blur: new line after each sentence ending
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const raw = el.innerText;
    if (raw.length < 60) return;

    // Replace ". " "! " "? " with ".\n\n" etc. (only between words)
    const formatted = raw.replace(/([.!?])\s+([A-ZÄÖÜ\u00C0-\u017E])/g, '$1\n\n$2');
    if (formatted === raw) return;

    el.innerText = formatted;
    onTextChange(el.innerHTML);
  }

  // Prevent image paste — images must go through the upload zone
  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          return;
        }
      }
    }
    // Strip HTML from pasted text — plain text only
    e.preventDefault();
    const plain = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, plain);
  }

  const placeholder = label === 'Vorderseite' ? 'Frage eingeben…' : 'Antwort eingeben…';

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="px-3 pt-3 pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>

      <div className="flex-1 flex flex-col mx-3 mb-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 focus-within:border-violet-500 transition-colors">
        <RichTextToolbar activeRef={globalActiveRef} />

        {imageUrl ? (
          <div className="relative" style={{ minHeight: 180 }}>
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-auto block"
              style={{ maxHeight: 300, objectFit: 'contain', background: '#0f172a' }}
            />
            <div className="p-3 bg-slate-800/90">
              <div
                ref={divRef}
                contentEditable
                suppressContentEditableWarning
                onFocus={syncActiveRef}
                onInput={handleInput}
                onBlur={handleBlur}
                onPaste={handlePaste}
                onCompositionStart={() => { isComposing.current = true; }}
                onCompositionEnd={(e) => {
                  isComposing.current = false;
                  onTextChange((e.target as HTMLDivElement).innerHTML);
                }}
                data-placeholder="Beschreibung zum Bild…"
                className="text-white text-sm focus:outline-none min-h-[36px] leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div
            ref={divRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={syncActiveRef}
            onInput={handleInput}
            onBlur={handleBlur}
            onPaste={handlePaste}
            onCompositionStart={() => { isComposing.current = true; }}
            onCompositionEnd={(e) => {
              isComposing.current = false;
              onTextChange((e.target as HTMLDivElement).innerHTML);
            }}
            data-placeholder={placeholder}
            className="flex-1 p-3 text-white text-sm focus:outline-none overflow-auto min-h-[120px] leading-relaxed"
          />
        )}

        <div className="px-3 pb-3 pt-1">
          <ImageUploadZone
            imageUrl={imageUrl}
            onUpload={onImageUpload}
            onRemove={onImageRemove}
            uploading={uploading}
          />
        </div>
      </div>
    </div>
  );
}
