import { NextResponse } from 'next/server';
import { decideApproval, type ApprovalDecision } from '../../../../../lib/server/approval-decisions';

const VALID_DECISIONS = new Set<ApprovalDecision>(['approved', 'rejected', 'changes_requested']);

export async function POST(request: Request, context: { params: Promise<{ approvalId: string }> }) {
  const payload = await request.json().catch(() => ({}));
  const decision = payload.decision as ApprovalDecision | undefined;
  const note = typeof payload.note === 'string' ? payload.note : undefined;

  if (!decision || !VALID_DECISIONS.has(decision)) {
    return NextResponse.json(
      { ok: false, message: 'A valid approval decision is required.' },
      { status: 400 }
    );
  }

  const { approvalId } = await context.params;
  const result = await decideApproval(approvalId, decision, note);

  return NextResponse.json(result, {
    status: result.status,
  });
}
