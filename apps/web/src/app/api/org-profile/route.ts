import { NextResponse } from 'next/server';
import { saveOrgProfile } from '../../../lib/server/write-actions';

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await saveOrgProfile(payload);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
