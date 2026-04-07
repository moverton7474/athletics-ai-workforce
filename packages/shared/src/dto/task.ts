import type { TaskStatus } from '../worker-types';

export interface TaskDTO {
  id: string;
  organizationId: string;
  workerId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}
