import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Folder, UserProfile, NoteSortOption, NoteFilterOption, ViewMode, SaveStatus, Attachment } from './types';
import { generateExcerptFromTiptap } from './utils';
import { isSupabaseConfigured } from './supabase/client';
import {
  getUUID,
  DEFAULT_DEMO_UUID,
  fetchUserDataFromSupabase,
  saveNoteToSupabase,
  deleteNoteFromSupabase,
  saveFolderToSupabase,
  deleteFolderFromSupabase,
} from './supabase/sync';

const INITIAL_USER: UserProfile = {
  id: DEFAULT_DEMO_UUID,
  user_id: DEFAULT_DEMO_UUID,
  email: 'alex.design@sucnote.com',
  full_name: 'Alex Rivera',
  avatar_url: '',
  bio: 'Product Designer & Thinker',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    user_id: DEFAULT_DEMO_UUID,
    parent_id: null,
    name: 'Work & Projects',
    icon: 'briefcase',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    user_id: DEFAULT_DEMO_UUID,
    parent_id: '11111111-1111-4111-a111-111111111111',
    name: 'SucNote Website Redesign',
    icon: 'globe',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    user_id: DEFAULT_DEMO_UUID,
    parent_id: null,
    name: 'Personal & Ideas',
    icon: 'user',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    user_id: DEFAULT_DEMO_UUID,
    parent_id: '33333333-3333-4333-a333-333333333333',
    name: 'Book Notes & Quotes',
    icon: 'book-open',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
    user_id: DEFAULT_DEMO_UUID,
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
    id: 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
    user_id: DEFAULT_DEMO_UUID,
    folder_id: '22222222-2222-4222-a222-222222222222',
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
    id: 'c3d4e5f6-a1b2-4c3d-0e4f-5a6b7c8d9e0f',
    user_id: DEFAULT_DEMO_UUID,
    folder_id: '44444444-4444-4444-a444-444444444444',
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
  syncWithSupabase: (userId?: string) => Promise<void>;

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

      syncWithSupabase: async (userId) => {
        if (!isSupabaseConfigured()) return;

        const targetUserId = userId || get().user?.id || DEFAULT_DEMO_UUID;
        const data = await fetchUserDataFromSupabase(targetUserId);

        if (data) {
          if (data.notes && data.folders) {
            if (data.notes.length === 0 && data.folders.length === 0) {
              // Supabase connected but database is empty: seed default folders and notes into Supabase once
              const defaultFolders = get().folders;
              const defaultNotes = get().notes;

              for (const f of defaultFolders) {
                await saveFolderToSupabase(f, targetUserId);
              }
              for (const n of defaultNotes) {
                await saveNoteToSupabase(n, targetUserId);
              }
            } else {
              // Update state directly from Supabase database
              set({
                folders: data.folders,
                notes: data.notes,
              });
            }
          }

          if (data.user) {
            const suUser = data.user;
            set((state) => ({
              user: state.user
                ? {
                    ...state.user,
                    id: suUser.id,
                    user_id: suUser.id,
                    email: suUser.email || state.user.email,
                    full_name: suUser.user_metadata?.full_name || state.user.full_name,
                  }
                : null,
              isAuthenticated: true,
            }));
          }
        }
      },

      notes: INITIAL_NOTES,
      saveStatus: 'saved',
      setSaveStatus: (saveStatus) => set({ saveStatus }),

      createNote: (folderId = null, title = 'Untitled Note', content = { type: 'doc', content: [] }) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        const newNote: Note = {
          id: getUUID(),
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

        // Background sync to Supabase
        saveNoteToSupabase(newNote, userId);

        return newNote;
      },

      updateNote: (id, updates) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => {
          const updatedNotes = state.notes.map((n) => {
            if (n.id !== id) return n;

            const newContent = updates.content !== undefined ? updates.content : n.content;
            const newTitle = updates.title !== undefined ? updates.title : n.title;

            updatedNoteObj = {
              ...n,
              ...updates,
              title: newTitle,
              content: newContent,
              excerpt: updates.excerpt || generateExcerptFromTiptap(newContent),
              updated_at: new Date().toISOString(),
            };
            return updatedNoteObj;
          });
          return { notes: updatedNotes, saveStatus: 'saved' };
        });

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
      },

      toggleFavoriteNote: (id) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === id) {
              updatedNoteObj = { ...n, is_favorite: !n.is_favorite, updated_at: new Date().toISOString() };
              return updatedNoteObj;
            }
            return n;
          }),
        }));

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
      },

      togglePinNote: (id) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === id) {
              updatedNoteObj = { ...n, is_pinned: !n.is_pinned, updated_at: new Date().toISOString() };
              return updatedNoteObj;
            }
            return n;
          }),
        }));

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
      },

      softDeleteNote: (id) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === id) {
              updatedNoteObj = { ...n, deleted_at: new Date().toISOString() };
              return updatedNoteObj;
            }
            return n;
          }),
        }));

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
        get().showToast('Note moved to trash', 'info');
      },

      restoreNote: (id) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === id) {
              updatedNoteObj = { ...n, deleted_at: null, updated_at: new Date().toISOString() };
              return updatedNoteObj;
            }
            return n;
          }),
        }));

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
        get().showToast('Note restored from trash', 'success');
      },

      permanentlyDeleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          attachments: state.attachments.filter((a) => a.note_id !== id),
        }));
        deleteNoteFromSupabase(id);
        get().showToast('Note permanently deleted', 'info');
      },

      emptyTrash: () => {
        const trashedNotes = get().notes.filter((n) => n.deleted_at !== null);
        set((state) => ({
          notes: state.notes.filter((n) => n.deleted_at === null),
        }));
        trashedNotes.forEach((n) => deleteNoteFromSupabase(n.id));
        get().showToast('Trash emptied', 'info');
      },

      moveNoteToFolder: (noteId, folderId) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedNoteObj: Note | null = null;

        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id === noteId) {
              updatedNoteObj = { ...n, folder_id: folderId, updated_at: new Date().toISOString() };
              return updatedNoteObj;
            }
            return n;
          }),
        }));

        if (updatedNoteObj) {
          saveNoteToSupabase(updatedNoteObj, userId);
        }
        get().showToast('Note moved successfully', 'success');
      },

      folders: INITIAL_FOLDERS,
      createFolder: (name, parentId = null, icon = 'folder') => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        const newFolder: Folder = {
          id: getUUID(),
          user_id: userId,
          parent_id: parentId,
          name,
          icon,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({ folders: [...state.folders, newFolder] }));
        saveFolderToSupabase(newFolder, userId);
        get().showToast(`Folder "${name}" created`, 'success');
        return newFolder;
      },

      updateFolder: (id, updates) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        let updatedFolderObj: Folder | null = null;

        set((state) => ({
          folders: state.folders.map((f) => {
            if (f.id === id) {
              updatedFolderObj = { ...f, ...updates, updated_at: new Date().toISOString() };
              return updatedFolderObj;
            }
            return f;
          }),
        }));

        if (updatedFolderObj) {
          saveFolderToSupabase(updatedFolderObj, userId);
        }
        get().showToast('Folder updated', 'success');
      },

      deleteFolder: (id) => {
        set((state) => {
          const folderIdsToDelete = new Set<string>([id]);

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

        deleteFolderFromSupabase(id);
        get().showToast('Folder deleted', 'info');
      },

      attachments: [],
      addAttachment: (attachment) => {
        const userId = get().user?.id || DEFAULT_DEMO_UUID;
        const newAttachment: Attachment = {
          ...attachment,
          id: getUUID(),
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
