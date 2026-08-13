'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth';
import { Note, Folder } from '@/lib/types';

export async function searchNotesAndFolders(query: string): Promise<{
  notes: Note[];
  folders: Folder[];
}> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { notes: [], folders: [] };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return { notes: [], folders: [] };
  }

  const supabase = await createServerSupabaseClient();
  const searchPattern = `%${trimmed}%`;

  const [notesRes, foldersRes] = await Promise.all([
    supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern}`)
      .order('updated_at', { ascending: false }),
    supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .ilike('name', searchPattern)
      .order('created_at', { ascending: true }),
  ]);

  return {
    notes: (notesRes.data || []) as unknown as Note[],
    folders: (foldersRes.data || []) as unknown as Folder[],
  };
}
