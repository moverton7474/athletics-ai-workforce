import { createAuthServerClient } from './auth/server';
import { getSupabaseServerClient } from './server/supabase-admin';
import { getSupabaseClient } from './supabase';

async function getQueryClient() {
  const authClient = await createAuthServerClient();

  if (authClient) {
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (user) {
      return authClient;
    }
  }

  return getSupabaseServerClient() || getSupabaseClient();
}

async function resolveQuery(queryFactory: (client: any) => any) {
  const client = await getQueryClient();
  if (!client) {
    return { data: [] as any[], error: 'Supabase env vars not configured' };
  }

  const { data, error } = await queryFactory(client);
  return { data: data ?? [], error: error?.message ?? null };
}

export async function fetchOrganizations() {
  return resolveQuery((client) => client.from('organizations').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchWorkers() {
  return resolveQuery((client) => client.from('agents').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchTasks() {
  return resolveQuery((client) => client.from('tasks').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchApprovals() {
  return resolveQuery((client) => client.from('approvals').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchKnowledgeItems() {
  return resolveQuery((client) => client.from('knowledge_items').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchConnectorRuns() {
  return resolveQuery((client) => client.from('connector_runs').select('*').order('created_at', { ascending: false }).limit(20));
}

export async function fetchMemoryEntries() {
  return resolveQuery((client) => client.from('memory_entries').select('*').order('created_at', { ascending: false }).limit(50));
}
