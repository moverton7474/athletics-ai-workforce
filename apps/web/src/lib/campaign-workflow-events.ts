export function buildCampaignWorkflowEvents({
  draftStatus,
  draftUpdatedAt,
  reviewSummary,
  reviewSummaryUpdatedAt,
  approvalSubmittedAt,
  approvalStatus,
  approvalDecisionNote,
  approvalDecidedAt,
  outcomeTaskId,
  outcomeTaskCreatedAt,
}: {
  draftStatus: string;
  draftUpdatedAt?: string;
  reviewSummary?: string;
  reviewSummaryUpdatedAt?: string;
  approvalSubmittedAt?: string;
  approvalStatus?: string;
  approvalDecisionNote?: string;
  approvalDecidedAt?: string;
  outcomeTaskId?: string;
  outcomeTaskCreatedAt?: string;
}) {
  const events: Array<{ label: string; detail?: string; at?: string }> = [];

  events.push({
    label: 'Draft state persisted',
    detail: `Draft status: ${draftStatus.replaceAll('_', ' ')}`,
    at: draftUpdatedAt,
  });

  if (reviewSummary) {
    events.push({
      label: 'Review summary captured',
      detail: reviewSummary,
      at: reviewSummaryUpdatedAt,
    });
  }

  if (approvalSubmittedAt) {
    events.push({
      label: 'Submitted for approval',
      detail: 'Campaign draft routed into the governed approval queue.',
      at: approvalSubmittedAt,
    });
  }

  if (approvalStatus && approvalStatus !== 'pending' && approvalStatus !== 'not_submitted') {
    events.push({
      label: 'Approval decision recorded',
      detail: `${approvalStatus.replaceAll('_', ' ')}${approvalDecisionNote ? ` · ${approvalDecisionNote}` : ''}`,
      at: approvalDecidedAt,
    });
  }

  if (outcomeTaskId) {
    events.push({
      label: 'Outcome task linked',
      detail: `Task id: ${outcomeTaskId}`,
      at: outcomeTaskCreatedAt,
    });
  }

  return events;
}
