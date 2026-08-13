import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Folder, UserProfile, NoteSortOption, NoteFilterOption, ViewMode, SaveStatus, Attachment } from './types';
import { generateExcerptFromTiptap } from './utils';

const INITIAL_USER: UserProfile = {
  id: 'usr_demo_01',
  user_id: 'usr_demo_01',
  email: 'alex.design@sucnote.com',
  full_name: 'Alex Rivera',
  avatar_url: '',
  bio: 'Product Designer & Thinker',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'fld_work',
    user_id: 'usr_demo_01',
    parent_id: null,
    name: 'Work & Projects',
    icon: 'briefcase',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fld_website',
    user_id: 'usr_demo_01',
    parent_id: 'fld_work',
    name: 'SucNote Website Redesign',
    icon: 'globe',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fld_personal',
    user_id: 'usr_demo_01',
    parent_id: null,
    name: 'Personal & Ideas',
    icon: 'user',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fld_books',
    user_id: 'usr_demo_01',
    parent_id: 'fld_personal',
    name: 'Book Notes & Quotes',
    icon: 'book-open',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note_welcome',
    user_id: 'usr_demo_01',
    folder_id: null,
    title: 'Welcome to SucNote',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Less interface. More thinking.' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'SucNote is designed to give you a distraction-free environment for writing, organizing, and retrieving your thoughts effortlessly.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Key Capabilities' }],
        },
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Real-time Tiptap autosaving with zero loss' }] }],
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Nested folders & organization' }] }],
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Type / for slash commands block menu' }] }],
            },
            {
              type: 'taskItem',
              attrs: { checked: false },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Global Cmd+K instant fuzzy search' }] }],
            },
          ],
        },
      ],
    },
    excerpt: 'SucNote is designed to give you a distraction-free environment for writing, organizing, and retrieving your thoughts effortlessly.',
    is_pinned: true,
    is_favorite: true,
    deleted_at: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'note_design_principles',
    user_id: 'usr_demo_01',
    folder_id: 'fld_website',
    title: 'SucNote Minimalist Design Principles',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Design Brief Specifications' }],
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Visual direction is strictly monochrome: black and white as primary brand colors with full light and dark mode support.',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Avoid unnecessary cards, excessive rounded corners, or bright brand colors. Focus strictly on typography and generous whitespace.',
            },
          ],
        },
      ],
    },
    excerpt: 'Visual direction is strictly monochrome: black and white as primary brand colors with full light and dark mode support.',
    is_pinned: false,
    is_favorite: true,
    deleted_at: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'note_reading_list',
    user_id: 'usr_demo_01',
    folder_id: 'fld_books',
    title: 'Atomic Habits - Essential Takeaways',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1% better every day leads to 37x improvement per year' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Focus on identity-based habits rather than outcome-based habits' }] }] },
          ],
        },
      ],
    },
    excerpt: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    is_pinned: false,
    is_favorite: false,
    deleted_at: null,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface SucNoteState {
  // Auth & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;

  // Notes State
  notes: Note[];
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  createNote: (folderId?: string | null, title?: string, content?: any) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  toggleFavoriteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  softDeleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  emptyTrash: () => void;
  moveNoteToFolder: (noteId: string, folderId: string | null) => void;

  // Folders State
  folders: Folder[];
  createFolder: (name: string, parentId?: string | null, icon?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // Attachments State
  attachments: Attachment[];
  addAttachment: (attachment: Omit<Attachment, 'id' | 'created_at'>) => void;
  deleteAttachment: (id: string) => void;

  // UI State
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
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

export const useSucNoteStore = create<SucNoteState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data, updated_at: new Date().toISOString() } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),

      notes: INITIAL_NOTES,
      saveStatus: 'saved',
      setSaveStatus: (saveStatus) => set({ saveStatus }),

      createNote: (folderId = null, title = 'Untitled Note', content = { type: 'doc', content: [] }) => {
        const userId = get().user?.id || 'usr_demo_01';
        const newNote: Note = {
          id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          user_id: userId,
          folder_id: folderId,
          title,
          content,
          excerpt: generateExcerptFromTiptap(content),
          is_pinned: false,
          is_favorite: false,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({ notes: [newNote, ...state.notes] }));
        return newNote;
      },

      updateNote: (id, updates) => {
        set((state) => {
          const updatedNotes = state.notes.map((n) => {
            if (n.id !== id) return n;

            const newContent = updates.content !== undefined ? updates.content : n.content;
            const newTitle = updates.title !== undefined ? updates.title : n.title;

            return {
              ...n,
              ...updates,
              title: newTitle,
              content: newContent,
              excerpt: updates.excerpt || generateExcerptFromTiptap(newContent),
              updated_at: new Date().toISOString(),
            };
          });
          return { notes: updatedNotes, saveStatus: 'saved' };
        });
      },

      toggleFavoriteNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, is_favorite: !n.is_favorite, updated_at: new Date().toISOString() } : n
          ),
        })),

      togglePinNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, is_pinned: !n.is_pinned, updated_at: new Date().toISOString() } : n
          ),
        })),

      softDeleteNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, deleted_at: new Date().toISOString() } : n
          ),
        }));
        get().showToast('Note moved to trash', 'info');
      },

      restoreNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, deleted_at: null } : n)),
        }));
        get().showToast('Note restored from trash', 'success');
      },

      permanentlyDeleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          attachments: state.attachments.filter((a) => a.note_id !== id),
        }));
        get().showToast('Note permanently deleted', 'info');
      },

      emptyTrash: () => {
        set((state) => ({
          notes: state.notes.filter((n) => n.deleted_at === null),
        }));
        get().showToast('Trash emptied', 'info');
      },

      moveNoteToFolder: (noteId, folderId) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, folder_id: folderId, updated_at: new Date().toISOString() } : n
          ),
        }));
        get().showToast('Note moved successfully', 'success');
      },

      folders: INITIAL_FOLDERS,
      createFolder: (name, parentId = null, icon = 'folder') => {
        const userId = get().user?.id || 'usr_demo_01';
        const newFolder: Folder = {
          id: `fld_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          user_id: userId,
          parent_id: parentId,
          name,
          icon,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({ folders: [...state.folders, newFolder] }));
        get().showToast(`Folder "${name}" created`, 'success');
        return newFolder;
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f
          ),
        }));
        get().showToast('Folder renamed', 'success');
      },

      deleteFolder: (id) => {
        // Unassign notes in deleted folder to null (or delete subfolders)
        set((state) => {
          const folderIdsToDelete = new Set<string>([id]);
          
          // Find nested subfolders recursively
          let addedNew = true;
          while (addedNew) {
            addedNew = false;
            state.folders.forEach((f) => {
              if (f.parent_id && folderIdsToDelete.has(f.parent_id) && !folderIdsToDelete.has(f.id)) {
                folderIdsToDelete.add(f.id);
                addedNew = true;
              }
            });
          }

          return {
            folders: state.folders.filter((f) => !folderIdsToDelete.has(f.id)),
            notes: state.notes.map((n) =>
              n.folder_id && folderIdsToDelete.has(n.folder_id) ? { ...n, folder_id: null } : n
            ),
          };
        });
        get().showToast('Folder deleted', 'info');
      },

      attachments: [],
      addAttachment: (attachment) => {
        const userId = get().user?.id || 'usr_demo_01';
        const newAttachment: Attachment = {
          ...attachment,
          id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          user_id: userId,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ attachments: [newAttachment, ...state.attachments] }));
        get().showToast('Attachment uploaded', 'success');
      },

      deleteAttachment: (id) => {
        set((state) => ({ attachments: state.attachments.filter((a) => a.id !== id) }));
        get().showToast('Attachment deleted', 'info');
      },

      theme: 'light',
      setTheme: (theme) => set({ theme }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

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
      name: 'sucnote-storage-v1',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        notes: state.notes,
        folders: state.folders,
        attachments: state.attachments,
        theme: state.theme,
        viewMode: state.viewMode,
      }),
    }
  )
);
