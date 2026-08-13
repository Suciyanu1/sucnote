export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  children?: Folder[];
  note_count?: number;
}

export interface Note {
  id: string;
  user_id: string;
  folder_id: string | null;
  title: string;
  content: any; // Tiptap JSON or string
  excerpt: string;
  is_pinned: boolean;
  is_favorite: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  user_id: string;
  note_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';

export type NoteSortOption = 'updated_at' | 'created_at' | 'title';
export type NoteFilterOption = 'all' | 'favorites' | 'pinned';
export type ViewMode = 'list' | 'grid';
