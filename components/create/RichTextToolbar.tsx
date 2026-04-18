'use client';

import { Bold, Italic, Underline } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RichTextToolbarProps {
  activeRef: React.RefObject<HTMLDivElement | null>;
}

const FORMATS = [
  { cmd: 'bold', icon: Bold, label: 'Fett' },
  { cmd: 'italic', icon: Italic, label: 'Kursiv' },
  { cmd: 'underline', icon: Underline, label: 'Unterstrichen' },
] as const;

export default function RichTextToolbar({ activeRef }: RichTextToolbarProps) {
  function applyFormat(cmd: string) {
    activeRef.current?.focus();
    document.execCommand(cmd, false);
  }

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-800/50 border-b border-slate-700 rounded-t-xl">
      {FORMATS.map(({ cmd, icon: Icon, label }) => (
        <button
          key={cmd}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat(cmd);
          }}
          title={label}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
