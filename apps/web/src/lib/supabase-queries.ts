import { getSupabaseClient } from './supabase';

export async function fetchOrganizations() {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: 'Supabase env vars not configured' };

  const { data, error } = await client.from('organizations').select('*').limit(20);
  return { data: data ?? [], error: error?.message ?? null };
}

export async function fetchWorkers() {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: 'Supabase env vars not configured' };

  const { data, error } = await client.from('agents').select('*').limit(20);
  return { data: data ?? [], error: error?.message ?? null };
}

export async function fetchTasks() {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: 'Supabase env vars not configured' };

  const { data, error } = await client.from('tasks').select('*').limit(20);
  return { data: data ?? [], error: error?.message ?? null };
}
