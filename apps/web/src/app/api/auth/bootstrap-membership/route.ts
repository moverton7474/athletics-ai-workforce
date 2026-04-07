import { NextResponse } from 'next/server';
import { DEMO_ORGANIZATION_ID } from '../../../../lib/constants';
import { createAuthServerClient } from '../../../../lib/auth/server';
import { getSupabaseServerClient } from '../../../../lib/server/supabase-admin';

export async function POST() {
  const authClient = await createAuthServerClient();
  const adminClient = getSupabaseServerClient();

  if (!authClient || !adminClient) {
    return NextResponse.json({ success: false, message: 'Auth or server database client is not configured.' }, { status: 500 });
  }

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, message: 'You must be signed in first.' }, { status: 401 });
  }

  const { error } = await adminClient.from('organization_members').upsert(
    {
      organization_id: DEMO_ORGANIZATION_ID,
      user_id: user.id,
      role: 'owner',
    },
    { onConflict: 'organization_id,user_id' }
  );

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: 'Demo organization membership granted.',
  });
}
