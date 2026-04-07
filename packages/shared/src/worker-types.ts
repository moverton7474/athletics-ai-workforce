export type UserRole =
  | 'owner'
  | 'admin'
  | 'operator'
  | 'collaborator'
  | 'security_compliance';

export type WorkerMode = 'shared' | 'personal';

export type WorkerStatus = 'active' | 'paused' | 'draft' | 'archived';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TaskStatus = 'queued' | 'in_progress' | 'blocked' | 'completed' | 'canceled';

export type WorkerTab = 'chat' | 'outputs' | 'guidelines' | 'settings';

export interface OrganizationProfile {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  targetCustomers?: string;
  country?: string;
  primaryLanguage?: string;
  toneOfVoice?: string;
}

export interface WorkerDefinition {
  id: string;
  organizationId: string;
  name: string;
  roleName: string;
  mode: WorkerMode;
  status: WorkerStatus;
  tabs: WorkerTab[];
}

export interface TaskRecord {
  id: string;
  organizationId: string;
  workerId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ApprovalRecord {
  id: string;
  organizationId: string;
  status: ApprovalStatus;
  requestedByWorkerId?: string;
}
