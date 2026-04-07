import { NextResponse } from 'next/server';
import { runSponsorAttritionConnector } from '../../../../lib/server/connector';

export async function POST() {
  const result = await runSponsorAttritionConnector();

  return NextResponse.json(result, {
    status: result.status,
  });
}
