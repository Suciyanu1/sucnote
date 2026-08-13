import { createClient, isSupabaseConfigured } from './client';
import { Note, Folder, UserProfile } from '../types';

export function getUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback valid UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const DEFAULT_DEMO_UUID = '00000000-0000-4000-a000-000000000001';

/** Converts any legacy or non-UUID string to a valid UUID v4 */
export function ensureValidUUID(id?: string | null): string {
  if (!id) return DEFAULT_DEMO_UUID;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  if (id === 'usr_demo_01') return DEFAULT_DEMO_UUID;
  if (id === 'fld_work' || id === '11111111-1111-4111-a111-111111111111') return '11111111-1111-4111-a111-111111111111';
  if (id === 'fld_website' || id === '22222222-2222-4222-a222-222222222222') return '22222222-2222-4222-a222-222222222222';
  if (id === 'fld_personal' || id === '33333333-3333-4333-a333-333333333333') return '33333333-3333-4333-a333-333333333333';
  if (id === 'fld_books' || id === '44444444-4444-4444-a444-444444444444') return '44444444-4444-4444-a444-444444444444';
  if (id === 'note_welcome' || id === 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d') return 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';

  return getUUID();
}

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------

export async function loginWithSupabase(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      isUnconfigured: true,
      error: 'Supabase URL and Anon Key are not configured in environment variables.',
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Fetch or create user profile
  let userProfile: UserProfile = {
    id: data.user.id,
    user_id: data.user.id,
    email: data.user.email || email,
    full_name: data.user.user_metadata?.full_name || email.split('@')[0],
    avatar_url: data.user.user_metadata?.avatar_url || '',
    bio: 'SucNote Thinker',
    created_at: data.user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      userProfile = { ...userProfile, ...profile };
    } else {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        user_id: data.user.id,
        full_name: userProfile.full_name,
        avatar_url: userProfile.avatar_url,
        bio: userProfile.bio,
      });
    }
  } catch {
    // Non-blocking if profiles table hasn't been migrated yet
  }

  return { success: true, user: userProfile, session: data.session };
}

export async function registerWithSupabase(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      isUnconfigured: true,
      error: 'Supabase URL and Anon Key are not configured in environment variables.',
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Registration failed. No user returned.' };
  }

  const userProfile: UserProfile = {
    id: data.user.id,
    user_id: data.user.id,
    email: data.user.email || email,
    full_name: fullName,
    avatar_url: '',
    bio: 'SucNote Thinker',
    created_at: data.user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      user_id: data.user.id,
      full_name: fullName,
      avatar_url: '',
      bio: 'SucNote Thinker',
    });
  } catch {
    // Ignore if profiles table is missing
  }

  return { success: true, user: userProfile, session: data.session };
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function updatePasswordInSupabase(password: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured' };
  }
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ----------------------------------------------------
// DATABASE SYNCING (NOTES & FOLDERS)
// ----------------------------------------------------

export async function fetchUserDataFromSupabase(userId?: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  try {
    const { data: authData } = await supabase.auth.getUser();
    const effectiveUserId = authData.user?.id || (userId ? ensureValidUUID(userId) : null);

    let foldersQuery = supabase.from('folders').select('*').order('created_at', { ascending: true });
    let notesQuery = supabase.from('notes').select('*').order('updated_at', { ascending: false });

    if (effectiveUserId) {
      foldersQuery = foldersQuery.eq('user_id', effectiveUserId);
      notesQuery = notesQuery.eq('user_id', effectiveUserId);
    }

    const [foldersRes, notesRes] = await Promise.all([foldersQuery, notesQuery]);

    return {
      folders: (foldersRes.data || []) as Folder[],
      notes: (notesRes.data || []) as Note[],
      user: authData.user || null,
    };
  } catch (err) {
    console.warn('Error loading Supabase data:', err);
    return null;
  }
}

export async function saveNoteToSupabase(note: Note, userId?: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  const validNoteId = ensureValidUUID(note.id);
  const validFolderId = note.folder_id ? ensureValidUUID(note.folder_id) : null;

  const { data: authData } = await supabase.auth.getUser();
  const validUserId = authData.user?.id || ensureValidUUID(userId || note.user_id);

  try {
    const { error } = await supabase.from('notes').upsert({
      id: validNoteId,
      user_id: validUserId,
      folder_id: validFolderId,
      title: note.title || 'Untitled Note',
      content: typeof note.content === 'string' ? JSON.parse(note.content) : (note.content || { type: 'doc', content: [] }),
      excerpt: note.excerpt || '',
      is_pinned: Boolean(note.is_pinned),
      is_favorite: Boolean(note.is_favorite),
      deleted_at: note.deleted_at || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase saveNote error:', error.message);
    }
  } catch (err) {
    console.warn('Failed to save note to Supabase:', err);
  }
}

export async function deleteNoteFromSupabase(noteId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  const validId = ensureValidUUID(noteId);
  try {
    await supabase.from('notes').delete().eq('id', validId);
  } catch (err) {
    console.warn('Failed to delete note from Supabase:', err);
  }
}

export async function saveFolderToSupabase(folder: Folder, userId?: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  const validFolderId = ensureValidUUID(folder.id);
  const validParentId = folder.parent_id ? ensureValidUUID(folder.parent_id) : null;

  const { data: authData } = await supabase.auth.getUser();
  const validUserId = authData.user?.id || ensureValidUUID(userId || folder.user_id);

  try {
    const { error } = await supabase.from('folders').upsert({
      id: validFolderId,
      user_id: validUserId,
      parent_id: validParentId,
      name: folder.name || 'Untitled Folder',
      icon: folder.icon || 'folder',
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase saveFolder error:', error.message);
    }
  } catch (err) {
    console.warn('Failed to save folder to Supabase:', err);
  }
}

export async function deleteFolderFromSupabase(folderId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = createClient();
  const validId = ensureValidUUID(folderId);
  try {
    await supabase.from('folders').delete().eq('id', validId);
  } catch (err) {
    console.warn('Failed to delete folder from Supabase:', err);
  }
}

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are unconfigured or using placeholder values.',
    };
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('notes').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If error is about missing table
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          connected: true,
          tablesCreated: false,
          message: 'Supabase connected successfully, but database tables (schema.sql) are not yet executed in Supabase.',
        };
      }
      return { connected: false, message: error.message };
    }
    return {
      connected: true,
      tablesCreated: true,
      message: 'Supabase connection verified! Auth & Database tables are active.',
    };
  } catch (err: any) {
    return { connected: false, message: err.message || 'Connection failed' };
  }
}
