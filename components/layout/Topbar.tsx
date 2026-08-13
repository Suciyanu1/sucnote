'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSucNoteStore } from '@/lib/store';
import { createNoteAction } from '@/lib/actions/notes';
import { logoutAction } from '@/lib/actions/auth';
import { getProfile } from '@/lib/actions/profile';
import { UserProfile } from '@/lib/types';
import {
  Sun,
  Moon,
  Plus,
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  X,
  FileText,
  Star,
  Folder,
  Trash2,
} from 'lucide-react';

const emptySubscribe = () => () => {};

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme, setSearchOpen, showToast } = useSucNoteStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    let active = true;
    getProfile().then((prof) => {
      if (active) setUserProfile(prof);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleCreateNote = async () => {
    const res = await createNoteAction();
    if (res.success && res.note) {
      router.push(`/app/notes/${res.note.id}`);
      router.refresh();
    } else {
      showToast(res.error || 'Failed to create note', 'error');
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    showToast('Signed out of session', 'info');
    router.push('/login');
    router.refresh();
  };

  const isDarkActive = mounted
    ? theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  const toggleThemeMode = () => {
    if (isDarkActive) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <>
      <header className="h-14 border-b border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#0A0A0A] px-4 md:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0">
        {/* Left Section: Mobile Menu Toggle & Search trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#666666] dark:text-[#A1A1A1] bg-[#FAFAFA] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#272727] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Search workspace...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded ml-1">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleThemeMode}
            title={isDarkActive ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-[#E5E5E5] dark:border-[#272727] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {isDarkActive ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-zinc-200 dark:hover:ring-zinc-800 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-bold text-xs flex items-center justify-center">
                {userProfile?.full_name ? userProfile.full_name[0].toUpperCase() : 'U'}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E5E5E5] dark:border-[#272727] bg-white dark:bg-[#141414] shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-[#E5E5E5] dark:border-[#272727]">
                  <p className="text-xs font-semibold text-[#111111] dark:text-[#F5F5F5] truncate">
                    {userProfile?.full_name || 'Account'}
                  </p>
                  <p className="text-[11px] text-[#666666] dark:text-[#A1A1A1] truncate mt-0.5">
                    {userProfile?.email || ''}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/app/settings/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    href="/app/settings/appearance"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Appearance & Theme</span>
                  </Link>
                </div>

                <div className="border-t border-[#E5E5E5] dark:border-[#272727] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAFAFA] dark:bg-[#141414] h-full shadow-2xl flex flex-col p-4 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] dark:border-[#272727]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <span className="font-bold text-sm">SucNote</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <Link
                href="/app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <FileText className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/app/notes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <FileText className="w-4 h-4" />
                <span>All Notes</span>
              </Link>
              <Link
                href="/app/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <Star className="w-4 h-4" />
                <span>Favorites</span>
              </Link>
              <Link
                href="/app/folders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <Folder className="w-4 h-4" />
                <span>Folders</span>
              </Link>
              <Link
                href="/app/trash"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <Trash2 className="w-4 h-4" />
                <span>Trash</span>
              </Link>
              <Link
                href="/app/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#111111] dark:text-[#F5F5F5] hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
