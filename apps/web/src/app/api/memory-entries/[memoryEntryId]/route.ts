import { NextResponse } from 'next/server';
import { deleteMemory, updateMemoryEntry } from '../../../../lib/server/write-actions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memoryEntryId: string }> },
) {
  const { memoryEntryId } = await params;
  const payload = await request.json();
  const result = await updateMemoryEntry(memoryEntryId, payload);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ memoryEntryId: string }> },
) {
  const { memoryEntryId } = await params;
  const result = await deleteMemory(memoryEntryId);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
