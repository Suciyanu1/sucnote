'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth';
import { Folder } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getFolders(): Promise<Folder[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching folders:', error?.message);
    return [];
  }

  return data as unknown as Folder[];
}

export async function getFolderById(id: string): Promise<Folder | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as Folder;
}

export async function createFolderAction(
  name: string,
  parentId: string | null = null,
  icon: string = 'folder'
) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  if (!name.trim()) {
    return { success: false, error: 'Folder name cannot be empty' };
  }

  const supabase = await createServerSupabaseClient();

  if (parentId) {
    const { data: parent } = await supabase
      .from('folders')
      .select('id')
      .eq('id', parentId)
      .eq('user_id', user.id)
      .single();

    if (!parent) {
      return { success: false, error: 'Parent folder not found or unauthorized' };
    }
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      user_id: user.id,
      parent_id: parentId,
      name: name.trim(),
      icon,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true, folder: data as unknown as Folder };
}

export async function updateFolderAction(
  id: string,
  updates: Partial<Pick<Folder, 'name' | 'icon' | 'parent_id'>>
) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) updatePayload.name = updates.name.trim();
  if (updates.icon !== undefined) updatePayload.icon = updates.icon;
  if (updates.parent_id !== undefined) {
    if (updates.parent_id !== null) {
      const { data: parent } = await supabase
        .from('folders')
        .select('id')
        .eq('id', updates.parent_id)
        .eq('user_id', user.id)
        .single();

      if (!parent) {
        return { success: false, error: 'Parent folder not found or unauthorized' };
      }
    }
    updatePayload.parent_id = updates.parent_id;
  }

  const { data, error } = await supabase
    .from('folders')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true, folder: data as unknown as Folder };
}

export async function deleteFolderAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}
