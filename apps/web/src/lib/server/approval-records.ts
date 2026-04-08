type ProposalApprovalInput = {
  company: string;
  connectorName: string;
  connectorOutput: Record<string, unknown> | null;
};

export function buildProposalApprovalRecord(input: ProposalApprovalInput) {
  const company = input.company.trim() || 'Unknown company';

  return {
    approvalType: 'proposal_review',
    title: `Approve proposal package for ${company}`,
    summary: `Review the generated proposal package for ${company} before submission.`,
    requestedAction: 'proposal_submit',
    targetSystem: 'ksu_csos',
    entityType: 'proposal',
    entityName: company,
    stage: 'draft_review',
    nextActionLabel: 'Approve for submission prep',
    details: {
      workflow_kind: 'proposal_review',
      company,
      stage: 'draft_review',
      requested_action: 'proposal_submit',
      target_system: 'ksu_csos',
      entity_type: 'proposal',
      entity_name: company,
      recommended_next_action: 'Approve for submission prep',
      connector_name: input.connectorName,
      connector_output: input.connectorOutput,
    },
  };
}

export function normalizeApprovalMetadata(approval: any) {
  const details = approval.details ?? {};

  return {
    requestedAction:
      approval.requested_action ??
      (typeof details.requested_action === 'string' ? details.requested_action : undefined),
    targetSystem:
      approval.target_system ??
      (typeof details.target_system === 'string' ? details.target_system : undefined),
    entityType:
      approval.entity_type ??
      (typeof details.entity_type === 'string' ? details.entity_type : undefined),
    entityName:
      approval.entity_name ??
      (typeof details.entity_name === 'string'
        ? details.entity_name
        : typeof details.company === 'string'
          ? details.company
          : undefined),
    stage:
      approval.stage ??
      (typeof details.stage === 'string' ? details.stage : undefined),
    nextActionLabel:
      approval.next_action_label ??
      (typeof details.recommended_next_action === 'string' ? details.recommended_next_action : undefined),
  };
}
