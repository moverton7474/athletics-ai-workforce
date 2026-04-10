import { DEMO_ORGANIZATION_ID } from '../constants';
import { PRIVILEGED_ORG_ROLES, requireDemoMembership } from './access';

export type ApprovalDecision = 'approved' | 'rejected' | 'changes_requested';

const DECISION_TO_TASK_STATUS: Record<ApprovalDecision, 'in_progress' | 'blocked'> = {
  approved: 'in_progress',
  rejected: 'blocked',
  changes_requested: 'in_progress',
};

function followUpTitle(decision: ApprovalDecision, company?: string) {
  if (decision === 'approved') {
    return `Prepare proposal submission${company ? ` for ${company}` : ''}`;
  }

  if (decision === 'changes_requested') {
    return `Revise proposal draft${company ? ` for ${company}` : ''}`;
  }

  return `Reassess proposal path${company ? ` for ${company}` : ''}`;
}

function followUpDescription(decision: ApprovalDecision, note?: string) {
  if (decision === 'approved') {
    return note?.trim()
      ? `Approval granted. Proceed with submission preparation. Decision note: ${note.trim()}`
      : 'Approval granted. Proceed with submission preparation.';
  }

  if (decision === 'changes_requested') {
    return note?.trim()
      ? `Changes requested before submission. Decision note: ${note.trim()}`
      : 'Changes requested before submission.';
  }

  return note?.trim()
    ? `Proposal was rejected for now. Decision note: ${note.trim()}`
    : 'Proposal was rejected for now.';
}

function mapDraftStatusFromDecision(decision: ApprovalDecision) {
  if (decision === 'approved') {
    return 'approved_for_launch';
  }

  if (decision === 'changes_requested') {
    return 'changes_requested';
  }

  return 'rejected';
}

function mapDraftWorkflowState(decision: ApprovalDecision) {
  if (decision === 'approved') {
    return 'approved_for_launch';
  }

  if (decision === 'changes_requested') {
    return 'revision_requested';
  }

  return 'closed_rejected';
}

export async function decideApproval(approvalId: string, decision: ApprovalDecision, note?: string) {
  const membershipCheck = await requireDemoMembership([...PRIVILEGED_ORG_ROLES]);
  if (!membershipCheck.ok) {
    return membershipCheck;
  }

  const { user, adminClient } = membershipCheck;
  const approvalResult = await adminClient
    .from('approvals')
    .select('*')
    .eq('id', approvalId)
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .maybeSingle();

  if (approvalResult.error) {
    return { ok: false as const, status: 400, message: approvalResult.error.message };
  }

  if (!approvalResult.data) {
    return { ok: false as const, status: 404, message: 'Approval request not found.' };
  }

  const approval = approvalResult.data;
  const existingDetails = approval.details ?? {};
  const existingDecisionHistory = Array.isArray(existingDetails.decision_history)
    ? existingDetails.decision_history
    : [];

  if (approval.status !== 'pending') {
    return {
      ok: false as const,
      status: 409,
      message: `This approval has already been decided (${approval.status.replaceAll('_', ' ')}).`,
    };
  }

  const trimmedNote = note?.trim() || null;
  const now = new Date().toISOString();

  const updateApproval = await adminClient
    .from('approvals')
    .update({
      status: decision,
      decision_note: trimmedNote,
      approved_by_user_id: user.id,
      decided_at: now,
      details: {
        ...existingDetails,
        latest_decision: {
          decision,
          note: trimmedNote,
          decided_at: now,
          decided_by_user_id: user.id,
        },
        decision_history: [
          ...existingDecisionHistory,
          {
            decision,
            note: trimmedNote,
            decided_at: now,
            decided_by_user_id: user.id,
          },
        ],
      },
    })
    .eq('id', approvalId);

  if (updateApproval.error) {
    return { ok: false as const, status: 400, message: updateApproval.error.message };
  }

  if (approval.task_id) {
    const updateTask = await adminClient
      .from('tasks')
      .update({
        status: DECISION_TO_TASK_STATUS[decision],
        description: followUpDescription(decision, trimmedNote ?? undefined),
      })
      .eq('id', approval.task_id);

    if (updateTask.error) {
      return { ok: false as const, status: 400, message: updateTask.error.message };
    }
  }

  if (approval.connector_run_id) {
    const updateRun = await adminClient
      .from('connector_runs')
      .update({
        status: decision,
        completed_at: now,
      })
      .eq('id', approval.connector_run_id);

    if (updateRun.error) {
      return { ok: false as const, status: 400, message: updateRun.error.message };
    }
  }

  const company = approval.details?.company as string | undefined;
  const followUpTask = await adminClient
    .from('tasks')
    .insert({
      organization_id: DEMO_ORGANIZATION_ID,
      agent_id: approval.requested_by_agent_id,
      title: followUpTitle(decision, company),
      description: followUpDescription(decision, trimmedNote ?? undefined),
      status: decision === 'rejected' ? 'blocked' : 'queued',
      priority: 'high',
    })
    .select('id')
    .single();

  if (followUpTask.error) {
    return { ok: false as const, status: 400, message: followUpTask.error.message };
  }

  const workflowState =
    decision === 'approved'
      ? 'submission_prep'
      : decision === 'changes_requested'
        ? 'revision_requested'
        : 'closed_rejected';

  const outcomeTaskUpdate = await adminClient
    .from('approvals')
    .update({
      outcome_task_id: followUpTask.data.id,
      details: {
        ...existingDetails,
        latest_decision: {
          decision,
          note: trimmedNote,
          decided_at: now,
          decided_by_user_id: user.id,
        },
        decision_history: [
          ...existingDecisionHistory,
          {
            decision,
            note: trimmedNote,
            decided_at: now,
            decided_by_user_id: user.id,
          },
        ],
        outcome_task_id: followUpTask.data.id,
        workflow_state: workflowState,
      },
    })
    .eq('id', approvalId);

  if (outcomeTaskUpdate.error) {
    return { ok: false as const, status: 400, message: outcomeTaskUpdate.error.message };
  }

  const draftKey = typeof existingDetails.draft_key === 'string' ? existingDetails.draft_key : null;
  if (draftKey) {
    const draftResult = await adminClient
      .from('campaign_drafts')
      .select('details')
      .eq('draft_key', draftKey)
      .eq('organization_id', DEMO_ORGANIZATION_ID)
      .maybeSingle();

    if (draftResult.error) {
      return { ok: false as const, status: 400, message: draftResult.error.message };
    }

    if (draftResult.data) {
      const currentDraftDetails = draftResult.data.details && typeof draftResult.data.details === 'object'
        ? draftResult.data.details
        : {};

      const updateDraft = await adminClient
        .from('campaign_drafts')
        .update({
          status: mapDraftStatusFromDecision(decision),
          details: {
            ...currentDraftDetails,
            approvalId: approvalId,
            approvalStatus: decision,
            approvalDecision: decision,
            approvalDecisionNote: trimmedNote,
            approvalDecidedAt: now,
            outcomeTaskId: followUpTask.data.id,
            outcomeTaskCreatedAt: now,
            workflowState: mapDraftWorkflowState(decision),
          },
          updated_at: now,
        })
        .eq('draft_key', draftKey)
        .eq('organization_id', DEMO_ORGANIZATION_ID);

      if (updateDraft.error) {
        return { ok: false as const, status: 400, message: updateDraft.error.message };
      }
    }
  }

  return {
    ok: true as const,
    status: 200,
    message:
      decision === 'approved'
        ? 'Approval recorded and proposal workflow advanced.'
        : decision === 'changes_requested'
          ? 'Change request recorded and a revision task was queued.'
          : 'Rejection recorded and follow-up review work was logged.',
    followUpTaskId: followUpTask.data.id,
  };
}
