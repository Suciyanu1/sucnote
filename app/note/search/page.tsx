'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { searchNotesAndFolders } from '@/lib/actions/search';
import { getFolders } from '@/lib/actions/folders';
import { Note, Folder } from '@/lib/types';
import { NoteCard } from '@/components/notes/NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Folder as FolderIcon, X } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [matchedNotes, setMatchedNotes] = useState<Note[]>([]);
  const [matchedFolders, setMatchedFolders] = useState<Folder[]>([]);
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFolders().then(setAllFolders);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMatchedNotes([]);
      setMatchedFolders([]);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = setTimeout(() => {
      searchNotesAndFolders(trimmed).then((res) => {
        if (active) {
          setMatchedNotes(res.notes);
          setMatchedFolders(res.folders);
          setLoading(false);
        }
      });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const folderMap = new Map<string, Folder>(allFolders.map((f) => [f.id, f]));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <div className="space-y-2 border-b border-[#E5E5E5] dark:border-[#272727] pb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Global Search</h1>
          <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
            Search titles, content excerpts, and folders across your entire workspace on Supabase.
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
                className="absolute right-3 top-4 p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
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
            description="Type keywords, titles, or concepts to instantly retrieve matching notes and folders from your database."
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
                      href={`/note/folders/${f.id}`}
                      className="p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] hover:border-zinc-400 flex items-center gap-2.5"
                    >
                      <FolderIcon className="w-4 h-4 text-zinc-400" />
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
                    <NoteCard
                      key={note.id}
                      note={note}
                      folder={note.folder_id ? folderMap.get(note.folder_id) : null}
                      viewMode="grid"
                    />
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
