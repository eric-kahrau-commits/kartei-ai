'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signIn } from '@/lib/firebase/auth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/home');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('E-Mail oder Passwort falsch.');
      } else {
        setError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        placeholder="••••••••"
        required
        autoComplete="current-password"
        minLength={6}
      />
      {error && <p className="text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" isLoading={loading} size="lg">
        Anmelden
      </Button>
      <p className="text-center text-sm text-slate-400">
        Noch kein Konto?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-violet-400 hover:text-violet-300 font-medium">
          Registrieren
        </button>
      </p>
    </form>
  );
}
