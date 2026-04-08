import { NextResponse } from 'next/server';
import { runProposalSubmitConnector } from '../../../../lib/server/connector';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const result = await runProposalSubmitConnector(payload.company);

  return NextResponse.json(result, {
    status: result.status,
  });
}
