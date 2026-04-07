import { getSupabaseClient } from './supabase';

export async function fetchOrganizationsStub() {
  const client = getSupabaseClient();
  return {
    client,
    data: [],
    note: 'Supabase query stub not wired yet.',
  };
}
