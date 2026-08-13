'use client';

import React, { useState, useEffect } from 'react';
import { useSucNoteStore } from '@/lib/store';
import { Folder, FolderPlus, X } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit?: { id: string; name: string; parent_id: string | null } | null;
  defaultParentId?: string | null;
}

export function FolderModal({
  isOpen,
  onClose,
  folderToEdit,
  defaultParentId = null,
}: FolderModalProps) {
  const { folders, createFolder, updateFolder } = useSucNoteStore();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(defaultParentId);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setParentId(folderToEdit.parent_id);
    } else {
      setName('');
      setParentId(defaultParentId);
    }
  }, [folderToEdit, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (folderToEdit) {
      updateFolder(folderToEdit.id, { name: name.trim(), parent_id: parentId });
    } else {
      createFolder(name.trim(), parentId);
    }

    onClose();
  };

  // Available parent folders (exclude current folder and its children to avoid cycles)
  const parentOptions = folders.filter((f) => !folderToEdit || f.id !== folderToEdit.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#111111] dark:text-[#F5F5F5]">
              {folderToEdit ? 'Rename Folder' : 'Create New Folder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work Projects, Personal Ideas..."
              className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-transparent text-sm text-[#111111] dark:text-[#F5F5F5] placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#666666] dark:text-[#A1A1A1] mb-1.5">
              Parent Folder (Optional)
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] text-sm text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
            >
              <option value="">(None - Top Level Folder)</option>
              {parentOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
