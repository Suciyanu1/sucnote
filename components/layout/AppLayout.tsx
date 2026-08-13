'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { Toast } from '../ui/Toast';
import { useSucNoteStore } from '@/lib/store';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { syncWithSupabase } = useSucNoteStore();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Initial sync with Supabase database
    syncWithSupabase();

    const supabase = createClient();

    // Listen to Auth session changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncWithSupabase(session.user.id);
      }
    });

    // Realtime changes listener for notes and folders
    const channel = supabase
      .channel('public_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        syncWithSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'folders' }, () => {
        syncWithSupabase();
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [syncWithSupabase]);

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
