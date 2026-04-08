import { mockApprovals } from '../../data/mock-approvals';
import { normalizeApprovalMetadata } from '../server/approval-records';
import type { ApprovalDTO } from '../types';
import { fetchApprovals } from '../supabase-queries';

function mapApprovalRow(approval: any): ApprovalDTO {
  const metadata = normalizeApprovalMetadata(approval);

  return {
    id: approval.id,
    organizationId: approval.organization_id,
    taskId: approval.task_id,
    connectorRunId: approval.connector_run_id,
    outcomeTaskId: approval.outcome_task_id,
    title: approval.title ?? approval.approval_type ?? 'Approval request',
    summary: approval.summary ?? metadata.nextActionLabel ?? undefined,
    status: approval.status,
    approvalType: approval.approval_type ?? 'standard',
    requestedAction: metadata.requestedAction,
    targetSystem: metadata.targetSystem,
    entityType: metadata.entityType,
    entityName: metadata.entityName,
    stage: metadata.stage,
    nextActionLabel: metadata.nextActionLabel,
    decisionNote: approval.decision_note,
    details: approval.details ?? {},
    createdAt: approval.created_at,
    decidedAt: approval.decided_at,
  };
}

export async function listApprovals() {
  const result = await fetchApprovals();
  if (result.error) {
    return {
      approvals: mockApprovals,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const approvals: ApprovalDTO[] = (result.data as Array<any>).map(mapApprovalRow);

  return {
    approvals,
    source: 'supabase' as const,
    error: null,
  };
}

export async function getApprovalById(approvalId: string) {
  const result = await listApprovals();
  return {
    approval: result.approvals.find((approval) => approval.id === approvalId) ?? null,
    source: result.source,
    error: result.error,
  };
}
