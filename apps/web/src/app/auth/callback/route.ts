import { NextResponse } from 'next/server';
import { createAuthServerClient } from '../../../lib/auth/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const client = await createAuthServerClient();
    await client?.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
