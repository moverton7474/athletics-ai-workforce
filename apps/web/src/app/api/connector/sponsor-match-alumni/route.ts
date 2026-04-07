import { NextResponse } from 'next/server';
import { runSponsorMatchAlumniConnector } from '../../../../lib/server/connector';

export async function POST() {
  const result = await runSponsorMatchAlumniConnector();

  return NextResponse.json(result, {
    status: result.status,
  });
}
