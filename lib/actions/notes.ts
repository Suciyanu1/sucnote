'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth';
import { Note } from '@/lib/types';
import { generateExcerptFromTiptap } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getNotes(): Promise<Note[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching notes:', error?.message);
    return [];
  }

  return data as unknown as Note[];
}

export async function getTrashNotes(): Promise<Note[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching trash notes:', error?.message);
    return [];
  }

  return data as unknown as Note[];
}

export async function getFavoriteNotes(): Promise<Note[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as unknown as Note[];
}

export async function getNoteById(id: string): Promise<Note | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as Note;
}

export async function createNoteAction(
  folderId: string | null = null,
  title: string = 'Untitled Note',
  content: any = { type: 'doc', content: [] }
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'Unauthenticated' };
  }

  // If folderId provided, check ownership
  if (folderId) {
    const supabase = await createServerSupabaseClient();
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', folderId)
      .eq('user_id', user.id)
      .single();

    if (!folder) {
      return { success: false, error: 'Target folder not found or unauthorized' };
    }
  }

  const excerpt = generateExcerptFromTiptap(content);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      folder_id: folderId,
      title,
      content,
      excerpt,
      is_pinned: false,
      is_favorite: false,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true, note: data as unknown as Note };
}

export async function updateNoteAction(
  id: string,
  updates: Partial<Pick<Note, 'title' | 'content' | 'excerpt' | 'is_pinned' | 'is_favorite' | 'folder_id'>>
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'Unauthenticated' };
  }

  const supabase = await createServerSupabaseClient();

  // Prepare updates object
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.content !== undefined) {
    updatePayload.content = updates.content;
    if (updates.excerpt === undefined) {
      updatePayload.excerpt = generateExcerptFromTiptap(updates.content);
    }
  }
  if (updates.excerpt !== undefined) updatePayload.excerpt = updates.excerpt;
  if (updates.is_pinned !== undefined) updatePayload.is_pinned = updates.is_pinned;
  if (updates.is_favorite !== undefined) updatePayload.is_favorite = updates.is_favorite;

  if (updates.folder_id !== undefined) {
    if (updates.folder_id !== null) {
      const { data: folder } = await supabase
        .from('folders')
        .select('id')
        .eq('id', updates.folder_id)
        .eq('user_id', user.id)
        .single();

      if (!folder) {
        return { success: false, error: 'Target folder not found or unauthorized' };
      }
    }
    updatePayload.folder_id = updates.folder_id;
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true, note: data as unknown as Note };
}

export async function toggleFavoriteNoteAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const note = await getNoteById(id);
  if (!note) return { success: false, error: 'Note not found' };

  return await updateNoteAction(id, { is_favorite: !note.is_favorite });
}

export async function togglePinNoteAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const note = await getNoteById(id);
  if (!note) return { success: false, error: 'Note not found' };

  return await updateNoteAction(id, { is_pinned: !note.is_pinned });
}

export async function softDeleteNoteAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}

export async function restoreNoteAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notes')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}

export async function permanentlyDeleteNoteAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}

export async function emptyTrashAction() {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}

export async function moveNoteToFolderAction(noteId: string, folderId: string | null) {
  return await updateNoteAction(noteId, { folder_id: folderId });
}
