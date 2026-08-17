'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { Toast } from '../ui/Toast';
import { useSucNoteStore } from '@/lib/store';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSucNoteStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5]">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full flex">
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
      <CommandPalette />
      <Toast />
    </div>
  );
}
