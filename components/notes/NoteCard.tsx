'use client';

import React from 'react';
import Link from 'next/link';
import { Note } from '@/lib/types';
import { useSucNoteStore } from '@/lib/store';
import { Star, Pin, Folder, Trash2, RotateCcw, MoreVertical } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  viewMode?: 'list' | 'grid';
  isTrash?: boolean;
}

export function NoteCard({ note, viewMode = 'list', isTrash = false }: NoteCardProps) {
  const {
    folders,
    toggleFavoriteNote,
    togglePinNote,
    softDeleteNote,
    restoreNote,
    permanentlyDeleteNote,
  } = useSucNoteStore();

  const folder = folders.find((f) => f.id === note.folder_id);

  if (viewMode === 'grid') {
    return (
      <div className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
        <div>
          {/* Header badges & Actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {folder && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 truncate">
                  <Folder className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </span>
              )}
              {note.is_pinned && !isTrash && (
                <span className="p-1 text-zinc-500" title="Pinned note">
                  <Pin className="w-3 h-3 fill-zinc-400 dark:fill-zinc-600" />
                </span>
              )}
            </div>

            {!isTrash && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavoriteNote(note.id);
                }}
                className="p-1 rounded text-zinc-400 hover:text-amber-500 transition-colors"
                title={note.is_favorite ? 'Unfavorite' : 'Favorite'}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    note.is_favorite ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Title & Excerpt */}
          <Link href={`/app/notes/${note.id}`} className="block group-hover:text-black dark:group-hover:text-white">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] truncate mb-1">
              {note.title || 'Untitled Note'}
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] line-clamp-3 leading-relaxed">
              {note.excerpt || 'Empty note...'}
            </p>
          </Link>
        </div>

        {/* Footer info & actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E5E5E5]/60 dark:border-[#272727]/60 text-[11px] text-[#666666] dark:text-[#A1A1A1]">
          <span>{formatDateRelative(note.updated_at)}</span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isTrash ? (
              <>
                <button
                  onClick={() => restoreNote(note.id)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                  title="Restore Note"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => permanentlyDeleteNote(note.id)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400"
                  title="Delete Permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => togglePinNote(note.id)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
                  title={note.is_pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => softDeleteNote(note.id)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400"
                  title="Move to Trash"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="group relative flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/50 dark:bg-[#141414]/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
      <Link href={`/app/notes/${note.id}`} className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
            {note.title || 'Untitled Note'}
          </h3>
          {note.is_pinned && !isTrash && (
            <Pin className="w-3 h-3 text-zinc-400 fill-zinc-400 shrink-0" />
          )}
          {folder && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <Folder className="w-2.5 h-2.5" />
              <span>{folder.name}</span>
            </span>
          )}
        </div>
        <p className="text-xs text-[#666666] dark:text-[#A1A1A1] truncate">
          {note.excerpt || 'Empty note...'}
        </p>
      </Link>

      <div className="flex items-center gap-3 shrink-0 text-xs text-[#666666] dark:text-[#A1A1A1]">
        <span className="hidden sm:inline">{formatDateRelative(note.updated_at)}</span>

        {!isTrash && (
          <button
            onClick={() => toggleFavoriteNote(note.id)}
            className="p-1 rounded text-zinc-400 hover:text-amber-500 transition-colors"
            title={note.is_favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star
              className={`w-4 h-4 ${
                note.is_favorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        )}

        <div className="flex items-center gap-1">
          {isTrash ? (
            <>
              <button
                onClick={() => restoreNote(note.id)}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                title="Restore Note"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => permanentlyDeleteNote(note.id)}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400"
                title="Delete Permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => softDeleteNote(note.id)}
              className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Move to Trash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
