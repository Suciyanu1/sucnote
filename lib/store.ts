import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteSortOption, NoteFilterOption, ViewMode, SaveStatus } from './types';

interface SucNoteUIState {
  // Save status for Tiptap editor
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;

  // Theme preference
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Sidebar visibility
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile sidebar overlay
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Global search & command palette UI
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // View preferences for lists/grids and filters
  sortOption: NoteSortOption;
  setSortOption: (sort: NoteSortOption) => void;
  filterOption: NoteFilterOption;
  setFilterOption: (filter: NoteFilterOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Toast notifications
  toastMessage: string | null;
  toastType: 'info' | 'success' | 'error';
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  clearToast: () => void;
}

export const useSucNoteStore = create<SucNoteUIState>()(
  persist(
    (set) => ({
      saveStatus: 'saved',
      setSaveStatus: (saveStatus) => set({ saveStatus }),

      theme: 'light',
      setTheme: (theme) => set({ theme }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      mobileSidebarOpen: false,
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),

      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      isSearchOpen: false,
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),

      sortOption: 'updated_at',
      setSortOption: (sortOption) => set({ sortOption }),
      filterOption: 'all',
      setFilterOption: (filterOption) => set({ filterOption }),
      viewMode: 'list',
      setViewMode: (viewMode) => set({ viewMode }),

      toastMessage: null,
      toastType: 'info',
      showToast: (toastMessage, toastType = 'info') => set({ toastMessage, toastType }),
      clearToast: () => set({ toastMessage: null }),
    }),
    {
      name: 'sucnote-ui-preferences',
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
        sortOption: state.sortOption,
      }),
    }
  )
);
