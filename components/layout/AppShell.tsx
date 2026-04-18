'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar
        isOpen={false}
        isCollapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onClose={() => {}}
        isMobile={false}
      />

      {/* Mobile sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={false}
        onToggleCollapse={() => {}}
        onClose={() => setSidebarOpen(false)}
        isMobile={true}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
