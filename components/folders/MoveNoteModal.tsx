'use client';

import React, { useState, useEffect } from 'react';
import { useSucNoteStore } from '@/lib/store';
import { getFolders } from '@/lib/actions/folders';
import { moveNoteToFolderAction } from '@/lib/actions/notes';
import { Folder as FolderType } from '@/lib/types';
import { Folder, FolderInput, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MoveNoteModalProps {
  isOpen: boolean;
  noteId: string;
  currentFolderId: string | null;
  onClose: () => void;
}

export function MoveNoteModal({
  isOpen,
  noteId,
  currentFolderId,
  onClose,
}: MoveNoteModalProps) {
  const router = useRouter();
  const { showToast } = useSucNoteStore();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);

  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId(currentFolderId);
      getFolders().then(setFolders);
    }
  }, [isOpen, currentFolderId]);

  if (!isOpen) return null;

  const handleMove = async () => {
    const res = await moveNoteToFolderAction(noteId, selectedFolderId);
    if (res.success) {
      showToast('Note moved successfully', 'success');
      onClose();
      router.refresh();
    } else {
      showToast(res.error || 'Failed to move note', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#272727] pb-3">
          <div className="flex items-center gap-2">
            <FolderInput className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
            <h3 className="text-base font-semibold text-[#111111] dark:text-[#F5F5F5]">
              Move Note to Folder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {/* No Folder Option */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              selectedFolderId === null
                ? 'bg-zinc-100 dark:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5]'
                : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-zinc-400" />
              <span>(No Folder - Unassigned)</span>
            </div>
            {selectedFolderId === null && <Check className="w-4 h-4 text-black dark:text-white" />}
          </button>

          {/* Folder List */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5]'
                    : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-zinc-400" />
                  <span>{folder.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-black dark:text-white" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#272727]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
          >
            Confirm Move
          </button>
        </div>
      </div>
    </div>
  );
}
