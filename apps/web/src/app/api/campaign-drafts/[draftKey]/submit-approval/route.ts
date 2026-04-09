import { NextResponse } from 'next/server';
import { submitCampaignDraftForApproval } from '../../../../../lib/server/write-actions';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ draftKey: string }> },
) {
  const { draftKey } = await params;
  const result = await submitCampaignDraftForApproval(draftKey);

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
