'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Note, Folder } from '@/lib/types';
import { useSucNoteStore } from '@/lib/store';
import {
  toggleFavoriteNoteAction,
  togglePinNoteAction,
  softDeleteNoteAction,
  restoreNoteAction,
  permanentlyDeleteNoteAction,
} from '@/lib/actions/notes';
import { Star, Pin, Folder as FolderIcon, Trash2, RotateCcw } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  folder?: Folder | null;
  viewMode?: 'list' | 'grid';
  isTrash?: boolean;
  onRefresh?: () => void;
}

export function NoteCard({
  note,
  folder,
  viewMode = 'list',
  isTrash = false,
  onRefresh,
}: NoteCardProps) {
  const router = useRouter();
  const { showToast } = useSucNoteStore();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleFavoriteNoteAction(note.id);
    if (res.success) {
      showToast(note.is_favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
      if (onRefresh) onRefresh();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to update favorite status', 'error');
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await togglePinNoteAction(note.id);
    if (res.success) {
      showToast(note.is_pinned ? 'Note unpinned' : 'Note pinned to top', 'info');
      if (onRefresh) onRefresh();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to pin note', 'error');
    }
  };

  const handleSoftDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await softDeleteNoteAction(note.id);
    if (res.success) {
      showToast('Note moved to trash', 'info');
      if (onRefresh) onRefresh();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to move note to trash', 'error');
    }
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await restoreNoteAction(note.id);
    if (res.success) {
      showToast('Note restored from trash', 'success');
      if (onRefresh) onRefresh();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to restore note', 'error');
    }
  };

  const handlePermanentDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await permanentlyDeleteNoteAction(note.id);
    if (res.success) {
      showToast('Note permanently deleted', 'info');
      if (onRefresh) onRefresh();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to delete note', 'error');
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className="group relative flex flex-col justify-between p-4 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
        <div>
          {/* Header badges & Actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {folder && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 truncate">
                  <FolderIcon className="w-2.5 h-2.5 shrink-0" />
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
                onClick={handleToggleFavorite}
                className="p-1 rounded text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
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
          <Link href={`/note/notes/${note.id}`} className="block group-hover:text-black dark:group-hover:text-white">
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
                  onClick={handleRestore}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  title="Restore Note"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handlePermanentDelete}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                  title="Delete Permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleTogglePin}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                  title={note.is_pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSoftDelete}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
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
      <Link href={`/note/notes/${note.id}`} className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
            {note.title || 'Untitled Note'}
          </h3>
          {note.is_pinned && !isTrash && (
            <Pin className="w-3 h-3 text-zinc-400 fill-zinc-400 shrink-0" />
          )}
          {folder && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <FolderIcon className="w-2.5 h-2.5" />
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
            onClick={handleToggleFavorite}
            className="p-1 rounded text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
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
                onClick={handleRestore}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                title="Restore Note"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handlePermanentDelete}
                className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                title="Delete Permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleSoftDelete}
              className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
