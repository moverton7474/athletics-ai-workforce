import { createClient } from '@supabase/supabase-js';

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
  };
}

export function getSupabaseClient() {
  const { url, anonKey, configured } = getSupabaseConfig();

  if (!configured || !url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}
