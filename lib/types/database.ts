export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          parent_id: string | null;
          name: string;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parent_id?: string | null;
          name: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parent_id?: string | null;
          name?: string;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string;
          content: Json;
          excerpt: string | null;
          is_pinned: boolean;
          is_favorite: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title?: string;
          content?: Json;
          excerpt?: string | null;
          is_pinned?: boolean;
          is_favorite?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          title?: string;
          content?: Json;
          excerpt?: string | null;
          is_pinned?: boolean;
          is_favorite?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      note_tags: {
        Row: {
          note_id: string;
          tag_id: string;
        };
        Insert: {
          note_id: string;
          tag_id: string;
        };
        Update: {
          note_id?: string;
          tag_id?: string;
        };
      };
      attachments: {
        Row: {
          id: string;
          user_id: string;
          note_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          note_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          created_at?: string;
        };
      };
    };
  };
}
