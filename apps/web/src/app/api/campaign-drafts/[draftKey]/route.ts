import { NextResponse } from 'next/server';
import { updateCampaignDraft } from '../../../../lib/server/write-actions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ draftKey: string }> },
) {
  const { draftKey } = await params;
  const payload = await request.json();
  const result = await updateCampaignDraft(draftKey, payload);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
