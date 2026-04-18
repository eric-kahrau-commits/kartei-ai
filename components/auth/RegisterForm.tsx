'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signUp } from '@/lib/firebase/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('email-already-in-use')) {
        setError('Diese E-Mail ist bereits registriert.');
      } else if (msg.includes('weak-password')) {
        setError('Passwort zu schwach. Mindestens 6 Zeichen.');
      } else {
        setError('Registrierung fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Dein Name"
        required
        autoComplete="name"
      />
      <Input
        label="E-Mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="du@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Passwort"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mindestens 6 Zeichen"
        required
        autoComplete="new-password"
        minLength={6}
      />
      {error && <p className="text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" isLoading={loading} size="lg">
        Konto erstellen
      </Button>
      <p className="text-center text-sm text-slate-400">
        Bereits registriert?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-violet-400 hover:text-violet-300 font-medium">
          Anmelden
        </button>
      </p>
    </form>
  );
}
