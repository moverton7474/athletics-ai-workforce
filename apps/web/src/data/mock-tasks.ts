import type { TaskDTO } from '../lib/types';

export const mockTasks: TaskDTO[] = [
  {
    id: 'task-1',
    organizationId: 'org-demo',
    workerId: 'worker-sponsorship-intelligence',
    title: 'Review sponsor attrition opportunities',
    description: 'Top roofing and healthcare categories need attention.',
    status: 'queued',
    priority: 'high',
  },
  {
    id: 'task-2',
    organizationId: 'org-demo',
    workerId: 'worker-chief-of-staff',
    title: 'Prepare executive morning briefing',
    description: 'Summarize tasks, approvals, and pipeline changes.',
    status: 'in_progress',
    priority: 'normal',
  },
];
