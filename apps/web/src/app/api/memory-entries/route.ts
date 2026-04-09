import { NextResponse } from 'next/server';
import { addMemoryEntry } from '../../../lib/server/write-actions';

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await addMemoryEntry(payload);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
