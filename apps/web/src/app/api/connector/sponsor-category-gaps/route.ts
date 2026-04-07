import { NextResponse } from 'next/server';
import { runSponsorCategoryGapsConnector } from '../../../../lib/server/connector';

export async function POST() {
  const result = await runSponsorCategoryGapsConnector();

  return NextResponse.json(result, {
    status: result.status,
  });
}
