'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getFavoriteNotes } from '@/lib/actions/notes';
import { getFolders } from '@/lib/actions/folders';
import { Note, Folder } from '@/lib/types';
import { NoteCard } from '@/components/notes/NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Star, Search } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();

  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    const [favs, fList] = await Promise.all([getFavoriteNotes(), getFolders()]);
    setFavoriteNotes(favs);
    setFolders(fList);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const filteredFavorites = query.trim()
    ? favoriteNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : favoriteNotes;

  const folderMap = new Map<string, Folder>(folders.map((f) => [f.id, f]));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
                Favorite Notes ({favoriteNotes.length})
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
                Quick access to your starred and most important notes.
              </p>
            </div>
          </div>

          {favoriteNotes.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search favorites..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {filteredFavorites.length === 0 ? (
          <EmptyState
            icon={Star}
            title={query ? 'No matching favorite notes' : 'No favorite notes yet'}
            description={
              query
                ? `No starred notes matched "${query}".`
                : 'Click the star icon on any note to add it to your favorites list for instant access.'
            }
            actionLabel={query ? 'Clear Search' : 'Browse your notes'}
            onAction={query ? () => setQuery('') : () => router.push('/note/notes')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavorites.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                folder={note.folder_id ? folderMap.get(note.folder_id) : null}
                viewMode="grid"
                onRefresh={fetchFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
