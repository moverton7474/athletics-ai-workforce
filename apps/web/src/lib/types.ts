export type WorkerMode = 'shared' | 'personal';
export type WorkerStatus = 'active' | 'paused' | 'draft' | 'archived';
export type TaskStatus = 'queued' | 'in_progress' | 'blocked' | 'completed' | 'canceled';
export type WorkerTab = 'chat' | 'outputs' | 'guidelines' | 'settings';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';
export type ConnectorRunStatus =
  | 'queued'
  | 'success'
  | 'failed'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

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

export interface ApprovalDTO {
  id: string;
  organizationId: string;
  taskId?: string | null;
  connectorRunId?: string | null;
  outcomeTaskId?: string | null;
  title: string;
  summary?: string;
  status: ApprovalStatus;
  approvalType: string;
  requestedAction?: string;
  targetSystem?: string;
  entityType?: string;
  entityName?: string;
  stage?: string;
  nextActionLabel?: string;
  decisionNote?: string | null;
  details?: Record<string, unknown>;
  createdAt?: string;
  decidedAt?: string | null;
}

export interface ConnectorRunDTO {
  id: string;
  label: string;
  status: ConnectorRunStatus | string;
  summary: string;
  detail?: string;
  createdAt?: string;
}
