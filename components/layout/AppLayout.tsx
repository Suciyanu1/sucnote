'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { Toast } from '../ui/Toast';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F5F5F5]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
      <CommandPalette />
      <Toast />
    </div>
  );
}
