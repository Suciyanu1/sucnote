'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from './auth';
import { UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getProfile(): Promise<UserProfile | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (data) {
    return {
      id: data.id,
      user_id: data.user_id || data.id,
      email: user.email || '',
      full_name: data.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      avatar_url: data.avatar_url || user.user_metadata?.avatar_url || '',
      bio: data.bio || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  // Fallback if profile row hasn't been created yet
  return {
    id: user.id,
    user_id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar_url: user.user_metadata?.avatar_url || '',
    bio: 'SucNote Thinker',
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateProfileAction(data: {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}) {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const supabase = await createServerSupabaseClient();
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (data.full_name !== undefined) updatePayload.full_name = data.full_name;
  if (data.bio !== undefined) updatePayload.bio = data.bio;
  if (data.avatar_url !== undefined) updatePayload.avatar_url = data.avatar_url;

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      user_id: user.id,
      ...updatePayload,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  // Also update auth user metadata if full_name provided
  if (data.full_name !== undefined) {
    await supabase.auth.updateUser({
      data: { full_name: data.full_name },
    });
  }

  revalidatePath('/note', 'layout');
  return { success: true };
}
