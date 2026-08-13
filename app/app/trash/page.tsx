'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getTrashNotes, emptyTrashAction } from '@/lib/actions/notes';
import { getFolders } from '@/lib/actions/folders';
import { Note, Folder } from '@/lib/types';
import { useSucNoteStore } from '@/lib/store';
import { NoteCard } from '@/components/notes/NoteCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Trash2 } from 'lucide-react';

export default function TrashPage() {
  const { showToast } = useSucNoteStore();

  const [trashNotes, setTrashNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isEmptyConfirmOpen, setIsEmptyConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTrashAndFolders = async () => {
    setLoading(true);
    const [tNotes, fList] = await Promise.all([getTrashNotes(), getFolders()]);
    setTrashNotes(tNotes);
    setFolders(fList);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrashAndFolders();
  }, []);

  const handleEmptyTrash = async () => {
    const res = await emptyTrashAction();
    if (res.success) {
      showToast('Trash emptied permanently', 'info');
      setIsEmptyConfirmOpen(false);
      fetchTrashAndFolders();
    } else {
      showToast(res.error || 'Failed to empty trash', 'error');
    }
  };

  const folderMap = new Map<string, Folder>(folders.map((f) => [f.id, f]));

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
                Trash ({trashNotes.length})
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
                Deleted notes remain here until restored or permanently emptied.
              </p>
            </div>
          </div>

          {trashNotes.length > 0 && (
            <button
              onClick={() => setIsEmptyConfirmOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash</span>
            </button>
          )}
        </div>

        {trashNotes.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="Trash is empty"
            description="Notes that you delete will appear here, where you can restore or permanently remove them."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trashNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                folder={note.folder_id ? folderMap.get(note.folder_id) : null}
                viewMode="grid"
                isTrash
                onRefresh={fetchTrashAndFolders}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isEmptyConfirmOpen}
        title="Empty Trash"
        description="Are you sure you want to permanently delete all notes in Trash? This action cannot be undone."
        confirmLabel="Empty Trash Permanently"
        isDestructive
        onConfirm={handleEmptyTrash}
        onClose={() => setIsEmptyConfirmOpen(false)}
      />
    </AppLayout>
  );
}
