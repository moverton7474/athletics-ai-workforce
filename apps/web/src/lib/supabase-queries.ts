import { getSupabaseClient } from './supabase';

async function resolveQuery(query: any) {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [] as any[], error: 'Supabase env vars not configured' };
  }

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}

export async function fetchOrganizations() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('organizations').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchWorkers() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('agents').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchTasks() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('tasks').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchApprovals() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('approvals').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchKnowledgeItems() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('knowledge_items').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchConnectorRuns() {
  const client = getSupabaseClient();
  if (!client) return { data: [] as any[], error: 'Supabase env vars not configured' };
  return resolveQuery(client.from('connector_runs').select('*').order('created_at', { ascending: false }).limit(20));
}
