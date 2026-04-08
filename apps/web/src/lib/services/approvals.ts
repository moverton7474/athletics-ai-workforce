import { mockApprovals } from '../../data/mock-approvals';
import type { ApprovalDTO } from '../types';
import { fetchApprovals } from '../supabase-queries';

export async function listApprovals() {
  const result = await fetchApprovals();
  if (result.error) {
    return {
      approvals: mockApprovals,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const approvals: ApprovalDTO[] = (result.data as Array<any>).map((approval) => ({
    id: approval.id,
    organizationId: approval.organization_id,
    taskId: approval.task_id,
    connectorRunId: approval.connector_run_id,
    title: approval.title ?? approval.approval_type ?? 'Approval request',
    summary: approval.summary ?? approval.details?.recommended_next_action ?? undefined,
    status: approval.status,
    approvalType: approval.approval_type ?? 'standard',
    decisionNote: approval.decision_note,
    details: approval.details ?? {},
    createdAt: approval.created_at,
    decidedAt: approval.decided_at,
  }));

  return {
    approvals,
    source: 'supabase' as const,
    error: null,
  };
}
