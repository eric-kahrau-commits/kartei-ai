'use client';

interface SetTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SetTitleInput({ value, onChange }: SetTitleInputProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Titel des Lernsets…"
        className="w-full text-2xl font-bold bg-transparent text-white placeholder-slate-600 border-b-2 border-slate-800 focus:border-violet-500 outline-none pb-2 transition-colors"
      />
    </div>
  );
}
