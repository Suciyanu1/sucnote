'use client';

import React, { useState, useEffect } from 'react';
import { useSucNoteStore } from '@/lib/store';
import { getFolders, createFolderAction, updateFolderAction } from '@/lib/actions/folders';
import { Folder as FolderType } from '@/lib/types';
import { FolderPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  if (!isOpen) return null;

  return (
    <FolderModalForm
      onClose={onClose}
      folderToEdit={folderToEdit}
      defaultParentId={defaultParentId}
    />
  );
}

function FolderModalForm({
  onClose,
  folderToEdit,
  defaultParentId = null,
}: {
  onClose: () => void;
  folderToEdit?: { id: string; name: string; parent_id: string | null } | null;
  defaultParentId?: string | null;
}) {
  const router = useRouter();
  const { showToast } = useSucNoteStore();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [name, setName] = useState(folderToEdit ? folderToEdit.name : '');
  const [parentId, setParentId] = useState<string | null>(
    folderToEdit ? folderToEdit.parent_id : defaultParentId
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFolders().then(setFolders);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    if (folderToEdit) {
      const res = await updateFolderAction(folderToEdit.id, { name: name.trim(), parent_id: parentId });
      setLoading(false);
      if (res.success) {
        showToast('Folder updated', 'success');
        onClose();
        router.refresh();
      } else {
        showToast(res.error || 'Failed to update folder', 'error');
      }
    } else {
      const res = await createFolderAction(name.trim(), parentId);
      setLoading(false);
      if (res.success) {
        showToast(`Folder "${name.trim()}" created`, 'success');
        onClose();
        router.refresh();
      } else {
        showToast(res.error || 'Failed to create folder', 'error');
      }
    }
  };

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
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md cursor-pointer"
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
              className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E5E5E5] dark:border-[#272727] text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Saving...' : folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
