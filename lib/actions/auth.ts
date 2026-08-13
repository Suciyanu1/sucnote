'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function loginAction(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true, user: data.user };
}

export async function registerAction(email: string, password: string, fullName: string) {
  const supabase = await createServerSupabaseClient();
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

  // Profile will be created via database trigger on auth.users, but upsert ensures fallback
  try {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      user_id: data.user.id,
      full_name: fullName,
      avatar_url: '',
      bio: 'SucNote Thinker',
    });
  } catch {
    // Non-blocking
  }

  revalidatePath('/', 'layout');
  return { success: true, user: data.user };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updatePasswordAction(password: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'Unauthenticated' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
