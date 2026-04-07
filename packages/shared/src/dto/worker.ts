import type { WorkerMode, WorkerStatus, WorkerTab } from '../worker-types';

export interface WorkerDTO {
  id: string;
  organizationId: string;
  name: string;
  roleName: string;
  mode: WorkerMode;
  status: WorkerStatus;
  tabs: WorkerTab[];
}
