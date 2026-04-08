import { NextResponse } from 'next/server';
import { runReportingConnector } from '../../../../lib/server/connector';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const result = await runReportingConnector(payload.reportType);

  return NextResponse.json(result, {
    status: result.status,
  });
}
