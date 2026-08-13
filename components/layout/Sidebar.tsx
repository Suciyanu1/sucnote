'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSucNoteStore } from '@/lib/store';
import {
  Home,
  FileText,
  Star,
  Trash2,
  Folder,
  Settings,
  Plus,
  ChevronRight,
  ChevronDown,
  Search,
  PanelLeftClose,
  PanelLeft,
  FolderPlus,
  User,
} from 'lucide-react';
import { buildFolderTree } from '@/lib/utils';
import { FolderModal } from '../folders/FolderModal';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarOpen,
    toggleSidebar,
    notes,
    folders,
    createNote,
    setSearchOpen,
    user,
  } = useSucNoteStore();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({
    fld_work: true,
    fld_personal: true,
  });

  const activeNotesCount = notes.filter((n) => n.deleted_at === null).length;
  const favoriteNotesCount = notes.filter((n) => n.deleted_at === null && n.is_favorite).length;
  const trashNotesCount = notes.filter((n) => n.deleted_at !== null).length;

  const folderTree = buildFolderTree(folders);

  const toggleFolderExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedFolderIds((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleCreateNewNote = () => {
    const newNote = createNote();
    router.push(`/app/notes/${newNote.id}`);
  };

  const navItems = [
    { label: 'Home', href: '/app', icon: Home, count: null },
    { label: 'Notes', href: '/app/notes', icon: FileText, count: activeNotesCount },
    { label: 'Favorites', href: '/app/favorites', icon: Star, count: favoriteNotesCount },
    { label: 'Trash', href: '/app/trash', icon: Trash2, count: trashNotesCount },
  ];

  const renderFolderItem = (folder: any, level = 0) => {
    const isExpanded = !!expandedFolderIds[folder.id];
    const hasChildren = folder.children && folder.children.length > 0;
    const isFolderActive = pathname === `/app/folders/${folder.id}`;
    const folderNoteCount = notes.filter((n) => n.deleted_at === null && n.folder_id === folder.id).length;

    return (
      <div key={folder.id} className="w-full">
        <Link
          href={`/app/folders/${folder.id}`}
          style={{ paddingLeft: `${12 + level * 12}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs transition-colors group ${
            isFolderActive
              ? 'bg-zinc-200/70 dark:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5] font-medium'
              : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-[#111111] dark:hover:text-[#F5F5F5]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleFolderExpand(folder.id, e)}
                className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>
            ) : (
              <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-0.5" />
            )}
            <span className="truncate">{folder.name}</span>
          </div>

          {folderNoteCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              {folderNoteCount}
            </span>
          )}
        </Link>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {folder.children.map((child: any) => renderFolderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!sidebarOpen) {
    return (
      <div className="hidden md:flex flex-col items-center py-4 px-2 border-r border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] w-14 shrink-0 transition-all">
        <button
          onClick={toggleSidebar}
          title="Expand sidebar"
          className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5] mb-4"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleCreateNewNote}
          title="Create New Note"
          className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black mb-4 shadow-xs"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="space-y-3 mt-2">
          <Link href="/app" title="Home" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 block text-zinc-600 dark:text-zinc-400">
            <Home className="w-4 h-4" />
          </Link>
          <Link href="/app/notes" title="Notes" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 block text-zinc-600 dark:text-zinc-400">
            <FileText className="w-4 h-4" />
          </Link>
          <Link href="/app/favorites" title="Favorites" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 block text-zinc-600 dark:text-zinc-400">
            <Star className="w-4 h-4" />
          </Link>
          <Link href="/app/folders" title="Folders" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 block text-zinc-600 dark:text-zinc-400">
            <Folder className="w-4 h-4" />
          </Link>
          <Link href="/app/trash" title="Trash" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 block text-zinc-600 dark:text-zinc-400">
            <Trash2 className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="w-64 border-r border-[#E5E5E5] dark:border-[#272727] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col h-full shrink-0 select-none transition-all duration-200">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#E5E5E5]/60 dark:border-[#272727]/60">
          <Link href="/app" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-sm tracking-tighter">
              S
            </div>
            <div>
              <span className="font-bold text-sm text-[#111111] dark:text-[#F5F5F5] tracking-tight block">
                SucNote
              </span>
              <span className="text-[10px] text-[#666666] dark:text-[#A1A1A1] block -mt-0.5">
                Workspace
              </span>
            </div>
          </Link>

          <button
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action & Global Search Trigger */}
        <div className="p-3 space-y-2">
          <button
            onClick={handleCreateNewNote}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Note</span>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg text-xs text-[#666666] dark:text-[#A1A1A1] bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#272727] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search...</span>
            </div>
            <kbd className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="p-2 space-y-0.5 border-b border-[#E5E5E5]/60 dark:border-[#272727]/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-zinc-200/80 dark:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5] font-semibold'
                    : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-[#111111] dark:hover:text-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && item.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Folders Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider">
            <Link href="/app/folders" className="hover:text-[#111111] dark:hover:text-[#F5F5F5]">
              Folders
            </Link>
            <button
              onClick={() => setIsFolderModalOpen(true)}
              title="Create new folder"
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-1 space-y-0.5">
            {folderTree.length === 0 ? (
              <p className="px-3 py-2 text-xs text-zinc-400 italic">No folders created yet</p>
            ) : (
              folderTree.map((f) => renderFolderItem(f))
            )}
          </div>
        </div>

        {/* Footer & User Settings link */}
        <div className="p-3 border-t border-[#E5E5E5] dark:border-[#272727] space-y-1">
          <Link
            href="/app/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
              pathname.startsWith('/app/settings')
                ? 'bg-zinc-200/80 dark:bg-zinc-800 text-[#111111] dark:text-[#F5F5F5] font-semibold'
                : 'text-[#666666] dark:text-[#A1A1A1] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-[#111111] dark:hover:text-[#F5F5F5]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          <Link
            href="/app/settings/profile"
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.full_name ? user.full_name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate block">
                {user?.full_name || 'Demo User'}
              </span>
              <span className="text-[10px] text-[#666666] dark:text-[#A1A1A1] truncate block">
                {user?.email || 'user@sucnote.com'}
              </span>
            </div>
          </Link>
        </div>
      </aside>

      <FolderModal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} />
    </>
  );
}
