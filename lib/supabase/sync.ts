import { createClient, isSupabaseConfigured } from './client';

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are unconfigured or using placeholder values.',
    };
  }

  const supabase = createClient();
  try {
    const { error } = await (supabase.from('notes') as any).select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
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
