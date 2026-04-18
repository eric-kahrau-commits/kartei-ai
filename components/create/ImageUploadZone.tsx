'use client';

import { useRef, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Spinner from '@/components/ui/Spinner';

interface ImageUploadZoneProps {
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  uploading?: boolean;
}

export default function ImageUploadZone({ imageUrl, onUpload, onRemove, uploading }: ImageUploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // If image already shown above, just show a remove button here
  if (imageUrl) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors px-1"
      >
        <X size={12} />
        Bild entfernen
      </button>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith('image/')) onUpload(file);
        }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-all duration-150 text-xs',
          dragOver
            ? 'border-violet-500 bg-violet-500/10 text-violet-400'
            : 'border-slate-600 hover:border-slate-500 text-slate-500 hover:text-slate-400 hover:bg-slate-700/50'
        )}
      >
        {uploading ? (
          <><Spinner size="sm" className="text-violet-400" /><span className="text-violet-400">Wird hochgeladen…</span></>
        ) : (
          <><ImageIcon size={13} /><span>Bild hinzufügen</span></>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
