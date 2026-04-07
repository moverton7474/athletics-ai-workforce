export type SupabaseStub = {
  url?: string;
  anonKey?: string;
};

export function getSupabaseClient(): SupabaseStub {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
