'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = stored ?? 'dark';
    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  function setTheme(t: 'dark' | 'light') {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, toggle };
}
