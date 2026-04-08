import type { WorkerDTO } from '../lib/types';

const workspaceContentByRole: Record<string, {
  mission: string;
  quickActions: string[];
  recentOutputs: Array<{ title: string; type: string; status: string; summary: string }>;
  guidelines: string[];
  settings: Array<{ label: string; value: string }>;
}> = {
  'Chief of Staff': {
    mission: 'Coordinate cross-functional athletics workflows, keep leadership aligned, and ensure the right next actions are visible.',
    quickActions: ['Prepare executive briefing', 'Review open approvals', 'Summarize sponsorship pipeline', 'Check cross-team blockers'],
    recentOutputs: [
      { title: 'Executive briefing draft', type: 'briefing', status: 'ready', summary: 'Morning summary of approvals, connector runs, and revenue pacing.' },
      { title: 'Leadership action list', type: 'task-summary', status: 'queued', summary: 'High-priority items requiring owner/admin review this week.' },
    ],
    guidelines: ['Prefer concise executive summaries.', 'Escalate blockers early.', 'Tie every recommendation to a concrete next action.'],
    settings: [
      { label: 'Default mode', value: 'Shared operator surface' },
      { label: 'Approval visibility', value: 'All pending approvals' },
      { label: 'Primary integration context', value: 'CSOS + workforce dashboard' },
    ],
  },
  'Executive Assistant': {
    mission: 'Keep leaders organized, prepare follow-ups, and maintain execution continuity between meetings and task cycles.',
    quickActions: ['Draft follow-up summary', 'Prepare meeting agenda', 'Review next actions', 'Package daily update'],
    recentOutputs: [
      { title: 'Daily action digest', type: 'digest', status: 'ready', summary: 'Summary of urgent tasks, upcoming approvals, and recent connector outcomes.' },
      { title: 'Meeting prep outline', type: 'outline', status: 'draft', summary: 'Preparation notes for leadership review and sponsorship planning.' },
    ],
    guidelines: ['Optimize for clarity and calm.', 'Group work by urgency.', 'Reduce switching cost for the human operator.'],
    settings: [
      { label: 'Default mode', value: 'Personal support surface' },
      { label: 'Auto-briefing cadence', value: 'Daily' },
      { label: 'Escalation policy', value: 'Surface urgent items first' },
    ],
  },
  'Sponsorship Intelligence': {
    mission: 'Analyze sponsorship opportunities, category gaps, and relationship signals to support pipeline growth.',
    quickActions: ['Run attrition review', 'Review category gaps', 'Inspect alumni matches', 'Prepare sponsor snapshot'],
    recentOutputs: [
      { title: 'Sponsor attrition watchlist', type: 'analysis', status: 'ready', summary: 'Acme Roofing and North Metro Bank flagged for review based on recent risk signals.' },
      { title: 'Category gap briefing', type: 'analysis', status: 'ready', summary: 'Roofing and banking remain the clearest sponsorship opportunity categories.' },
    ],
    guidelines: ['Prioritize actionable signal over raw data volume.', 'Highlight confidence level and business rationale.', 'Route sensitive actions through approval steps.'],
    settings: [
      { label: 'Default mode', value: 'Shared revenue operator surface' },
      { label: 'Primary downstream system', value: 'CSOS sponsorship pipeline' },
      { label: 'Approval gating', value: 'Required before proposal-stage actions' },
    ],
  },
};

const fallbackContent = {
  mission: 'Support athletics operations through guided AI-assisted workflows.',
  quickActions: ['Review tasks', 'Inspect outputs', 'Update guidelines', 'Check settings'],
  recentOutputs: [
    { title: 'No recent outputs yet', type: 'placeholder', status: 'draft', summary: 'This worker will surface generated outputs here as the workspace matures.' },
  ],
  guidelines: ['Keep work auditable.', 'Prefer clear next actions.', 'Escalate when confidence is low.'],
  settings: [
    { label: 'Mode', value: 'Not configured' },
    { label: 'Integrations', value: 'Pending' },
  ],
};

export function getWorkerWorkspaceContent(worker: WorkerDTO) {
  return workspaceContentByRole[worker.roleName] ?? fallbackContent;
}
