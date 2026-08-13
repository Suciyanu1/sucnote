'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteFilterSortBar } from '@/components/notes/NoteFilterSortBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Search, FileText } from 'lucide-react';

export default function NotesPage() {
  const router = useRouter();
  const {
    notes,
    sortOption,
    filterOption,
    viewMode,
    createNote,
  } = useSucNoteStore();

  const [localQuery, setLocalQuery] = useState('');

  const activeNotes = notes.filter((n) => n.deleted_at === null);

  // Apply filters
  let filteredNotes = activeNotes.filter((n) => {
    if (filterOption === 'favorites') return n.is_favorite;
    if (filterOption === 'pinned') return n.is_pinned;
    return true;
  });

  // Apply search query
  if (localQuery.trim()) {
    const q = localQuery.toLowerCase();
    filteredNotes = filteredNotes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)
    );
  }

  // Apply sorting
  filteredNotes.sort((a, b) => {
    // Keep pinned notes at the top if sorting all
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;

    if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === 'created_at') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const handleCreateNote = () => {
    const newNote = createNote();
    router.push(`/app/notes/${newNote.id}`);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              All Notes ({activeNotes.length})
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
              Browse, filter, and organize all active notes across your workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Filter notes..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleCreateNote}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <NoteFilterSortBar />

        {/* Notes Container */}
        {filteredNotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={localQuery ? 'No matching notes found' : "You haven't created any notes yet"}
            description={
              localQuery
                ? `No notes matched "${localQuery}". Try clearing your search query or filters.`
                : 'Click below to create your first note and start writing immediately.'
            }
            actionLabel={localQuery ? 'Clear Filter' : 'Create your first note'}
            onAction={localQuery ? () => setLocalQuery('') : handleCreateNote}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-2'
            }
          >
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
