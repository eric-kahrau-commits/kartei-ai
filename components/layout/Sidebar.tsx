'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, LogOut, BookOpen, X, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  isMobile: boolean;
}

const NAV = [
  { href: '/home', label: 'Startseite', icon: Home },
  { href: '/learn', label: 'Lernen', icon: BookOpen },
  { href: '/create', label: 'Erstellen', icon: PlusSquare },
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 p-4 border-b border-slate-800', isCollapsed && !isMobile && 'justify-center')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        {(!isCollapsed || isMobile) && (
          <span className="font-bold text-white text-lg tracking-tight">Kartei<span className="text-violet-400">AI</span></span>
        )}
        {isMobile && (
          <button onClick={onClose} className="ml-auto p-1 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-violet-600/20 text-violet-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800',
                isCollapsed && !isMobile && 'justify-center px-2'
              )}
            >
              <Icon size={18} className={active ? 'text-violet-400' : ''} />
              {(!isCollapsed || isMobile) && <span className="text-sm">{label}</span>}
              {active && (!isCollapsed || isMobile) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn('p-3 border-t border-slate-800 space-y-1', isCollapsed && !isMobile && 'flex flex-col items-center')}>
        <ThemeToggle className="w-full justify-center" />
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 text-sm',
            isCollapsed && !isMobile && 'justify-center px-2'
          )}
        >
          <LogOut size={18} />
          {(!isCollapsed || isMobile) && 'Abmelden'}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-md"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={onClose}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:hidden"
              >
                <div className="relative h-full">{sidebarContent}</div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative h-full hidden lg:block flex-shrink-0"
    >
      {sidebarContent}
    </motion.aside>
  );
}
