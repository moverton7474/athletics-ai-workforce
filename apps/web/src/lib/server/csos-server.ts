import { createClient } from '@supabase/supabase-js';

export function getCsosServerClient() {
  const url = process.env.CSOS_SUPABASE_URL;
  const serviceRoleKey = process.env.CSOS_SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.CSOS_SUPABASE_ANON_KEY;
  const key = serviceRoleKey || anonKey;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getCsosServerMode() {
  if (process.env.CSOS_SUPABASE_URL && process.env.CSOS_SUPABASE_SERVICE_ROLE_KEY) {
    return 'service_role' as const;
  }

  if (process.env.CSOS_SUPABASE_URL && process.env.CSOS_SUPABASE_ANON_KEY) {
    return 'anon' as const;
  }

  return 'stub' as const;
}
