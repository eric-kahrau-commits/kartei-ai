import { Layers, CreditCard, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  totalSets: number;
  totalCards: number;
  avgProgress: number;
}

export default function StatsBar({ totalSets, totalCards, avgProgress }: StatsBarProps) {
  const stats = [
    { label: 'Lernsets', value: totalSets, icon: Layers, color: 'text-violet-400' },
    { label: 'Karten gesamt', value: totalCards, icon: CreditCard, color: 'text-indigo-400' },
    { label: 'Ø Fortschritt', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon size={16} className={color} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}
