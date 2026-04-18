'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    ghost: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}

export function buttonClass(
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  extra?: string
) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none';
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    ghost: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  return cn(base, variants[variant], sizes[size], extra);
}
