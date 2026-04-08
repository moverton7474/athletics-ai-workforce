import type { ApprovalDTO } from '../lib/types';

export const mockApprovals: ApprovalDTO[] = [
  {
    id: 'approval-1',
    organizationId: 'org-demo',
    taskId: 'task-1',
    connectorRunId: 'run-1',
    title: 'Approve sponsor outreach sequence',
    summary: 'Review the next sponsor outreach package before it is sent.',
    status: 'pending',
    approvalType: 'outreach_review',
    details: {
      company: 'Academy Roofing',
      stage: 'human_review',
      recommended_next_action: 'Approve the outreach draft or request changes.',
    },
  },
  {
    id: 'approval-2',
    organizationId: 'org-demo',
    taskId: 'task-2',
    connectorRunId: 'run-2',
    title: 'Approve proposal submission for Academy Roofing',
    summary: 'Proposal package is staged and waiting for an approval decision.',
    status: 'pending',
    approvalType: 'proposal_review',
    details: {
      company: 'Academy Roofing',
      stage: 'draft_review',
      recommended_next_action: 'Approve submission prep.',
    },
  },
];
