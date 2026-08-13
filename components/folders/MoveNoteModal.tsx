'use client';

import React, { useState } from 'react';
import { useSucNoteStore } from '@/lib/store';
import { Folder, FolderInput, X, Check } from 'lucide-react';

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
  const { folders, moveNoteToFolder } = useSucNoteStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);

  if (!isOpen) return null;

  const handleMove = () => {
    moveNoteToFolder(noteId, selectedFolderId);
    onClose();
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
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {/* No Folder Option */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
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
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
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
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
          >
            Confirm Move
          </button>
        </div>
      </div>
    </div>
  );
}
