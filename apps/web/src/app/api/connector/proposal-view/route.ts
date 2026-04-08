import { NextResponse } from 'next/server';
import { runProposalViewConnector } from '../../../../lib/server/connector';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const result = await runProposalViewConnector(payload.company);

  return NextResponse.json(result, {
    status: result.status,
  });
}
