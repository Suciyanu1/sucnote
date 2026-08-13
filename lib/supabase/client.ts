import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-project')) {
    // Graceful fallback dummy client if Supabase is unconfigured
    return createBrowserClient(
      'https://dummy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
