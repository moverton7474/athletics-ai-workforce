export type WorkerMode = 'shared' | 'personal';
export type WorkerStatus = 'active' | 'paused' | 'draft' | 'archived';
export type TaskStatus = 'queued' | 'in_progress' | 'blocked' | 'completed' | 'canceled';
export type WorkerTab = 'chat' | 'outputs' | 'guidelines' | 'settings';

export interface WorkerDTO {
  id: string;
  organizationId: string;
  name: string;
  roleName: string;
  mode: WorkerMode;
  status: WorkerStatus;
  tabs: WorkerTab[];
}

export interface TaskDTO {
  id: string;
  organizationId: string;
  workerId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}
