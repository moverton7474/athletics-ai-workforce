import { DEMO_ORGANIZATION_ID } from '../constants';
import { createAuthServerClient } from '../auth/server';
import { getSupabaseServerClient } from './supabase-admin';

export const PRIVILEGED_ORG_ROLES = ['owner', 'admin', 'operator'] as const;

export type OrganizationRole = (typeof PRIVILEGED_ORG_ROLES)[number] | 'collaborator';

export async function requireDemoMembership(allowedRoles?: string[]) {
  const authClient = await createAuthServerClient();
  const adminClient = getSupabaseServerClient();

  if (!authClient || !adminClient) {
    return { ok: false as const, status: 500, message: 'Auth or database client is not configured.' };
  }

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, message: 'You must be signed in first.' };
  }

  const membership = await adminClient
    .from('organization_members')
    .select('role')
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .eq('user_id', user.id)
    .maybeSingle();

  if (membership.error) {
    return { ok: false as const, status: 400, message: membership.error.message };
  }

  if (!membership.data) {
    return {
      ok: false as const,
      status: 403,
      message: 'You need organization membership before running this action.',
    };
  }

  if (allowedRoles?.length && !allowedRoles.includes(membership.data.role)) {
    return {
      ok: false as const,
      status: 403,
      message: 'Your role does not allow this action.',
    };
  }

  return {
    ok: true as const,
    user,
    adminClient,
    membership: membership.data,
  };
}
