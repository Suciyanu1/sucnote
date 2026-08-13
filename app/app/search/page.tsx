'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { NoteCard } from '@/components/notes/NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Folder, FileText, X } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { notes, folders } = useSucNoteStore();
  const [query, setQuery] = useState('');

  const activeNotes = notes.filter((n) => n.deleted_at === null);

  const matchedNotes = query.trim()
    ? activeNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedFolders = query.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <div className="space-y-2 border-b border-[#E5E5E5] dark:border-[#272727] pb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Global Search</h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            Search titles, content excerpts, and folders across your entire workspace.
          </p>

          <div className="relative pt-2">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search notes and folders..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-base text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-4 p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {!query.trim() ? (
          <EmptyState
            icon={Search}
            title="Start typing to search"
            description="Type keywords, titles, or concepts to instantly retrieve matching notes and folders."
          />
        ) : (
          <div className="space-y-8">
            {/* Matching Folders */}
            {matchedFolders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1A1]">
                  Matching Folders ({matchedFolders.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {matchedFolders.map((f) => (
                    <Link
                      key={f.id}
                      href={`/app/folders/${f.id}`}
                      className="p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] hover:border-zinc-400 flex items-center gap-2.5"
                    >
                      <Folder className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
                        {f.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1A1]">
                Matching Notes ({matchedNotes.length})
              </h3>
              {matchedNotes.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No notes matched your query.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} viewMode="grid" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
