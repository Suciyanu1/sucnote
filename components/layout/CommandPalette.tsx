'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSucNoteStore } from '@/lib/store';
import { searchNotesAndFolders } from '@/lib/actions/search';
import { getNotes } from '@/lib/actions/notes';
import { getFolders } from '@/lib/actions/folders';
import { Note, Folder } from '@/lib/types';
import { Search, FileText, Folder as FolderIcon, Star, X, ArrowRight } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';

export function CommandPalette() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useSucNoteStore();
  const [query, setQuery] = useState('');

  const [matchedNotes, setMatchedNotes] = useState<Note[]>([]);
  const [matchedFolders, setMatchedFolders] = useState<Folder[]>([]);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    let active = true;

    if (query.trim()) {
      searchNotesAndFolders(query).then((res) => {
        if (active) {
          setMatchedNotes(res.notes);
          setMatchedFolders(res.folders);
        }
      });
    } else {
      Promise.all([getNotes(), getFolders()]).then(([nData, fData]) => {
        if (active) {
          setMatchedNotes(nData.slice(0, 5));
          setMatchedFolders(fData.slice(0, 3));
        }
      });
    }

    return () => {
      active = false;
    };
  }, [query, isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelectNote = (noteId: string) => {
    setSearchOpen(false);
    setQuery('');
    router.push(`/note/notes/${noteId}`);
  };

  const handleSelectFolder = (folderId: string) => {
    setSearchOpen(false);
    setQuery('');
    router.push(`/note/folders/${folderId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E5E5] dark:border-[#272727]">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, content, or folders... (Cmd+K)"
            className="w-full bg-transparent text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mr-2 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto p-2 divide-y divide-[#E5E5E5]/50 dark:divide-[#272727]/50">
          {/* Notes Section */}
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider">
              {query.trim() ? 'Notes' : 'Recent Notes'}
            </div>
            {matchedNotes.length === 0 ? (
              <p className="px-3 py-3 text-xs text-zinc-400">No matching notes found.</p>
            ) : (
              matchedNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <FileText className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#111111] dark:text-[#F5F5F5] truncate flex items-center gap-1.5">
                        <span>{note.title || 'Untitled Note'}</span>
                        {note.is_favorite && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-[#666666] dark:text-[#A1A1A1] truncate mt-0.5">
                        {note.excerpt || 'No content...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-zinc-400">{formatDateRelative(note.updated_at)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Folders Section */}
          {matchedFolders.length > 0 && (
            <div className="pt-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider">
                Folders
              </div>
              {matchedFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleSelectFolder(folder.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 shrink-0" />
                    <span className="text-sm font-medium text-[#111111] dark:text-[#F5F5F5] truncate">
                      {folder.name}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2.5 border-t border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-[11px] text-[#666666] dark:text-[#A1A1A1] flex items-center justify-between">
          <span>Search entire workspace</span>
          <button
            onClick={() => {
              setSearchOpen(false);
              router.push('/note/search');
            }}
            className="hover:underline font-medium text-[#111111] dark:text-[#F5F5F5] cursor-pointer"
          >
            Advanced search →
          </button>
        </div>
      </div>
    </div>
  );
}
