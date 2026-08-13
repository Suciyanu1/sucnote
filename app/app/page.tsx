'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { NoteCard } from '@/components/notes/NoteCard';
import { getProfile } from '@/lib/actions/profile';
import { getNotes, createNoteAction } from '@/lib/actions/notes';
import { getFolders } from '@/lib/actions/folders';
import { UserProfile, Note, Folder } from '@/lib/types';
import { useSucNoteStore } from '@/lib/store';
import { Plus, FileText, Star, Folder as FolderIcon, ArrowRight, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useSucNoteStore();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    const [prof, nData, fData] = await Promise.all([
      getProfile(),
      getNotes(),
      getFolders(),
    ]);
    setUser(prof);
    setNotes(nData);
    setFolders(fData);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const activeNotes = notes.filter((n) => n.deleted_at === null);
  const favoriteNotes = activeNotes.filter((n) => n.is_favorite);
  const recentNotes = [...activeNotes]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  const handleCreateNote = async () => {
    const res = await createNoteAction();
    if (res.success && res.note) {
      router.push(`/app/notes/${res.note.id}`);
    } else {
      showToast(res.error || 'Failed to create note', 'error');
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const folderMap = new Map<string, Folder>(folders.map((f) => [f.id, f]));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
        {/* Welcome Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              {getTimeGreeting()}, {user?.full_name || 'Friend'}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">
              &quot;Less interface. More thinking.&quot; Here is your workspace summary.
            </p>
          </div>

          <button
            onClick={handleCreateNote}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Note</span>
          </button>
        </div>

        {/* Quick Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/app/notes"
            className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider block">
                Total Notes
              </span>
              <span className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5]">
                {activeNotes.length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <FileText className="w-5 h-5" />
            </div>
          </Link>

          <Link
            href="/app/favorites"
            className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider block">
                Favorites
              </span>
              <span className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5]">
                {favoriteNotes.length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-amber-500">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </Link>

          <Link
            href="/app/folders"
            className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider block">
                Folders
              </span>
              <span className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5]">
                {folders.length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <FolderIcon className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Recent Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111111] dark:text-[#F5F5F5] flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Recent Notes</span>
            </h2>
            <Link
              href="/app/notes"
              className="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentNotes.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#272727] space-y-2">
              <p className="text-sm text-zinc-500">You haven&apos;t created any notes yet.</p>
              <button
                onClick={handleCreateNote}
                className="text-xs font-semibold text-black dark:text-white underline cursor-pointer"
              >
                Create your first note →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folder={note.folder_id ? folderMap.get(note.folder_id) : null}
                  viewMode="grid"
                  onRefresh={loadDashboardData}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Folders Section */}
        {folders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111111] dark:text-[#F5F5F5] flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-zinc-400" />
                <span>Folders</span>
              </h2>
              <Link
                href="/app/folders"
                className="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1"
              >
                <span>Manage folders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {folders.slice(0, 4).map((f) => {
                const count = activeNotes.filter((n) => n.folder_id === f.id).length;
                return (
                  <Link
                    key={f.id}
                    href={`/app/folders/${f.id}`}
                    className="p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/60 dark:bg-[#141414]/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
                        {f.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500 font-medium">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
