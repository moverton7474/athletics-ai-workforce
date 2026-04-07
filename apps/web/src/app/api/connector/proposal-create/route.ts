import { NextResponse } from 'next/server';
import { runProposalCreateConnector } from '../../../../lib/server/connector';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const result = await runProposalCreateConnector(payload.company);

  return NextResponse.json(result, {
    status: result.status,
  });
}
