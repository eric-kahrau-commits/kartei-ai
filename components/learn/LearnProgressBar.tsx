interface LearnProgressBarProps {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
}

export default function LearnProgressBar({ current, total, correct, incorrect }: LearnProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Karte <span className="text-white font-semibold">{current}</span> von {total}
        </span>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-400">✓ {correct}</span>
          <span className="text-rose-400">✗ {incorrect}</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((current - 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
