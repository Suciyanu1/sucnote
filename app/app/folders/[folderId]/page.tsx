'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSucNoteStore } from '@/lib/store';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { NoteCard } from '@/components/notes/NoteCard';
import { FolderModal } from '@/components/folders/FolderModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Folder,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Search,
} from 'lucide-react';

export default function SingleFolderPage({ params }: { params: Promise<{ folderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { folders, notes, createNote, deleteFolder } = useSucNoteStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [query, setQuery] = useState('');

  const currentFolder = folders.find((f) => f.id === resolvedParams.folderId);
  const parentFolder = currentFolder?.parent_id ? folders.find((f) => f.id === currentFolder.parent_id) : null;

  if (!currentFolder) {
    return (
      <AppLayout>
        <div className="p-10 max-w-2xl mx-auto">
          <EmptyState
            icon={Folder}
            title="Folder not found"
            description="The requested folder does not exist or has been deleted."
            actionLabel="Return to Folders"
            onAction={() => router.push('/app/folders')}
          />
        </div>
      </AppLayout>
    );
  }

  // Child subfolders
  const childFolders = folders.filter((f) => f.parent_id === currentFolder.id);

  // Notes in this folder
  const folderNotes = notes.filter(
    (n) => n.deleted_at === null && n.folder_id === currentFolder.id
  );

  const filteredFolderNotes = query.trim()
    ? folderNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : folderNotes;

  const handleCreateNoteInFolder = () => {
    const newNote = createNote(currentFolder.id);
    router.push(`/app/notes/${newNote.id}`);
  };

  const breadcrumbItems = parentFolder
    ? [
        { id: parentFolder.id, name: parentFolder.name, href: `/app/folders/${parentFolder.id}` },
        { id: currentFolder.id, name: currentFolder.name },
      ]
    : [{ id: currentFolder.id, name: currentFolder.name }];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Folder Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] dark:border-[#272727]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] dark:text-[#F5F5F5] tracking-tight">
                {currentFolder.name}
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#A1A1A1]">
                {folderNotes.length} {folderNotes.length === 1 ? 'note' : 'notes'} inside folder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Rename Folder"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Delete Folder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreateNoteInFolder}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Note in Folder</span>
            </button>
          </div>
        </div>

        {/* Subfolders Section */}
        {childFolders.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#A1A1A1]">
              Subfolders
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {childFolders.map((sub) => {
                const subNoteCount = notes.filter((n) => n.deleted_at === null && n.folder_id === sub.id).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => router.push(`/app/folders/${sub.id}`)}
                    className="p-3 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA]/70 dark:bg-[#141414]/70 hover:border-zinc-400 dark:hover:border-zinc-600 text-left transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Folder className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
                        {sub.name}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                      {subNoteCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Search */}
        {folderNotes.length > 0 && (
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes in folder..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#111111] dark:text-[#F5F5F5] focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Folder Notes List */}
        {filteredFolderNotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={query ? 'No matching notes in folder' : 'This folder is empty'}
            description={
              query
                ? `No notes matched "${query}".`
                : 'Add notes to this folder to keep your project content organized.'
            }
            actionLabel={query ? 'Clear Search' : 'Create note in folder'}
            onAction={query ? () => setQuery('') : handleCreateNoteInFolder}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFolderNotes.map((note) => (
              <NoteCard key={note.id} note={note} viewMode="grid" />
            ))}
          </div>
        )}
      </div>

      <FolderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        folderToEdit={{ id: currentFolder.id, name: currentFolder.name, parent_id: currentFolder.parent_id }}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Folder"
        description={`Are you sure you want to delete "${currentFolder.name}"? Notes inside will remain active as unassigned.`}
        confirmLabel="Delete Folder"
        isDestructive
        onConfirm={() => {
          deleteFolder(currentFolder.id);
          router.push('/app/folders');
        }}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />
    </AppLayout>
  );
}
