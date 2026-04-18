export function calcProgressPercent(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-emerald-500';
  if (percent >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}
