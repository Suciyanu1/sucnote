'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth';
import { Attachment } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAttachments(noteId: string): Promise<Attachment[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('note_id', noteId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as Attachment[];
}

export async function addAttachmentAction(data: {
  note_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
}) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { data: created, error } = await supabase
    .from('attachments')
    .insert({
      user_id: user.id,
      note_id: data.note_id,
      file_name: data.file_name,
      file_url: data.file_url,
      file_type: data.file_type,
      file_size: data.file_size,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/app', 'layout');
  return { success: true, attachment: created as unknown as Attachment };
}

export async function deleteAttachmentAction(id: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/app', 'layout');
  return { success: true };
}
