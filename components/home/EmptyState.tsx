import Link from 'next/link';
import { Plus, CreditCard, Brain, Mic } from 'lucide-react';
import { buttonClass } from '@/components/ui/Button';

const FEATURES = [
  {
    icon: CreditCard,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Karteikarten erstellen',
    desc: 'Frage & Antwort, Bilder, Fettdruck, Kursiv – alles in einem.',
  },
  {
    icon: Mic,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Diktat-Eingabe',
    desc: 'Sprich deine Karten einfach ein, statt alles zu tippen.',
  },
  {
    icon: Brain,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'KI-Lernübersicht',
    desc: 'Lass dir den Stoff aus deinen Karten strukturiert zusammenfassen.',
  },
];

export default function EmptyState() {
  return (
    <div className="py-10 px-2">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-5 shadow-lg shadow-violet-900/30">
          <CreditCard size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Willkommen bei KarteiAI</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Erstelle dein erstes Lernset und lerne effizienter – mit Karteikarten, Diktat und KI-Zusammenfassungen.
        </p>
        <Link href="/create" className={`${buttonClass('primary', 'md')} mt-6 inline-flex`}>
          <Plus size={16} />
          Erstes Set erstellen
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
          <div key={title} className={`rounded-2xl border p-5 ${bg}`}>
            <Icon size={22} className={`${color} mb-3`} />
            <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
