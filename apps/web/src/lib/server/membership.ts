import { createAuthServerClient } from '../auth/server';
import { getSupabaseServerClient } from './supabase-admin';

export async function getCurrentUserContext() {
  const authClient = await createAuthServerClient();
  if (!authClient) {
    return { user: null, memberships: [], authConfigured: false };
  }

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return { user: null, memberships: [], authConfigured: true };
  }

  const adminClient = getSupabaseServerClient();
  if (!adminClient) {
    return { user, memberships: [], authConfigured: true };
  }

  const { data } = await adminClient
    .from('organization_members')
    .select('role, organization:organizations(id, name)')
    .eq('user_id', user.id);

  return {
    user,
    memberships: data ?? [],
    authConfigured: true,
  };
}
