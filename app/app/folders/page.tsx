'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { buildFolderTree } from '@/lib/utils';
import { FolderModal } from '@/components/folders/FolderModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Folder,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Plus,
  FileText,
} from 'lucide-react';

export default function FoldersPage() {
  const { folders, notes, deleteFolder } = useSucNoteStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string; parent_id: string | null } | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);
  const [parentForNewSubfolder, setParentForNewSubfolder] = useState<string | null>(null);

  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({
    fld_work: true,
    fld_personal: true,
  });

  const activeNotes = notes.filter((n) => n.deleted_at === null);
  const folderTree = buildFolderTree(folders);

  const toggleExpand = (id: string) => {
    setExpandedFolderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubfolder = (parentId: string) => {
    setParentForNewSubfolder(parentId);
    setEditingFolder(null);
    setIsCreateModalOpen(true);
  };

  const handleRename = (f: any) => {
    setEditingFolder({ id: f.id, name: f.name, parent_id: f.parent_id });
    setIsCreateModalOpen(true);
  };

  const renderFolderRow = (f: any, level = 0) => {
    const isExpanded = !!expandedFolderIds[f.id];
    const hasChildren = f.children && f.children.length > 0;
    const noteCount = activeNotes.filter((n) => n.folder_id === f.id).length;

    return (
      <div key={f.id} className="space-y-1">
        <div
          className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(f.id)}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 shrink-0 text-zinc-500"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <Folder className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
            )}

            <Link href={`/app/folders/${f.id}`} className="min-w-0 flex-1 group-hover:underline">
              <span className="text-sm font-semibold text-[#111111] dark:text-[#F5F5F5] truncate block">
                {f.name}
              </span>
            </Link>

            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
              {noteCount} {noteCount === 1 ? 'note' : 'notes'}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
            <button
              onClick={() => handleAddSubfolder(f.id)}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              title="Add Subfolder"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRename(f)}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              title="Rename Folder"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFolderToDelete({ id: f.id, name: f.name })}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400"
              title="Delete Folder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {f.children.map((child: any) => renderFolderRow(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
              Folders & Categories
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#A1A1A1] mt-0.5">
              Organize your notes into nested folders and subfolders.
            </p>
          </div>

          <button
            onClick={() => {
              setParentForNewSubfolder(null);
              setEditingFolder(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        </div>

        {folderTree.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="No folders created yet"
            description="Folders help you structure projects and keep your notes tidy."
            actionLabel="Create your first folder"
            onAction={() => {
              setParentForNewSubfolder(null);
              setEditingFolder(null);
              setIsCreateModalOpen(true);
            }}
          />
        ) : (
          <div className="space-y-2">
            {folderTree.map((f) => renderFolderRow(f))}
          </div>
        )}
      </div>

      <FolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        folderToEdit={editingFolder}
        defaultParentId={parentForNewSubfolder}
      />

      <ConfirmDialog
        isOpen={!!folderToDelete}
        title="Delete Folder"
        description={`Are you sure you want to delete "${folderToDelete?.name}"? Notes inside this folder will remain active but will no longer be assigned to a folder.`}
        confirmLabel="Delete Folder"
        isDestructive
        onConfirm={() => {
          if (folderToDelete) deleteFolder(folderToDelete.id);
        }}
        onClose={() => setFolderToDelete(null)}
      />
    </AppLayout>
  );
}
