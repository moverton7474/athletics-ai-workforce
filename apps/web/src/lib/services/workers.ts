import { mockWorkers } from '../../data/mock-workers';
import { fetchWorkers } from '../supabase-queries';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO, WorkerWorkspaceSnapshotDTO } from '../types';
import { listApprovals } from './approvals';
import { listMemoryEntries } from './memory';
import { listTasks } from './tasks';

export async function listWorkers() {
  const result = await fetchWorkers();
  if (result.error) {
    return {
      workers: mockWorkers,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const workers = (result.data as Array<any>).map((worker) => ({
      id: worker.id,
      organizationId: worker.organization_id,
      name: worker.name,
      roleName: worker.role_name,
      mode: worker.mode,
      status: worker.status,
      tabs: Array.isArray(worker.tabs) ? worker.tabs : ['chat', 'outputs', 'guidelines', 'settings'],
    }));

  return {
    workers,
    source: 'supabase' as const,
    error: null,
  };
}

function buildWorkerWorkspaceSnapshot(worker: WorkerDTO, tasks: TaskDTO[], approvals: ApprovalDTO[], memoryEntries: MemoryEntryDTO[]): WorkerWorkspaceSnapshotDTO {
  const workerTasks = tasks.filter((task) => task.workerId === worker.id);
  const activeTasks = workerTasks.filter((task) => !['completed', 'canceled'].includes(task.status));
  const workerTaskIds = new Set(workerTasks.map((task) => task.id));
  const workerApprovals = approvals.filter(
    (approval) =>
      (approval.taskId && workerTaskIds.has(approval.taskId)) ||
      (approval.outcomeTaskId && workerTaskIds.has(approval.outcomeTaskId)),
  );
  const pendingApprovals = workerApprovals.filter((approval) => approval.status === 'pending');
  const workerMemoryEntries = memoryEntries.filter((entry) => entry.workerId === worker.id);
  const pinnedMemory = workerMemoryEntries.filter((entry) => entry.pinned === true);
  const taskLinkedMemory = workerMemoryEntries.filter((entry) => !!entry.taskId);
  const approvalLinkedMemory = workerMemoryEntries.filter((entry) => !!entry.approvalId);

  const ownershipLabel = worker.mode === 'shared' ? 'Shared organization workspace' : 'Personal operator workspace';
  const accountabilityLabel =
    worker.mode === 'shared' ? 'Team-visible ownership with governed handoffs' : 'Operator-owned support with private prep context';
  const navigationLabel = worker.mode === 'shared' ? 'Shared workflow workspace' : 'Personal support workspace';
  const collaborationSummary =
    worker.mode === 'shared'
      ? 'Built for collaborative execution, review loops, and cross-operator visibility.'
      : 'Built for one operator’s planning, prep, and follow-through without turning every note into a team surface.';
  const handoffSummary = pendingApprovals.length
    ? 'Waiting on human approval before all downstream work is truly safe to move.'
    : activeTasks.length
      ? 'Active worker-owned work is in motion and should keep continuity attached to tasks and notes.'
      : 'No urgent worker-owned blockers are visible right now; keep the workspace ready for the next handoff.';
  const routeEntrySummary =
    worker.mode === 'shared'
      ? 'Operators should be able to enter from tasks, approvals, dashboard queues, or direct worker navigation and still see the same ownership state.'
      : 'Operators should be able to jump in from their own prep flow, then decide what graduates into shared team workflows.';

  return {
    workerId: worker.id,
    ownershipLabel,
    accountabilityLabel,
    navigationLabel,
    collaborationSummary,
    handoffSummary,
    routeEntrySummary,
    openTaskCount: activeTasks.length,
    activeTaskCount: workerTasks.length,
    pendingApprovalCount: pendingApprovals.length,
    linkedApprovalCount: workerApprovals.length,
    linkedMemoryCount: workerMemoryEntries.length,
    pinnedMemoryCount: pinnedMemory.length,
    taskLinkedMemoryCount: taskLinkedMemory.length,
    approvalLinkedMemoryCount: approvalLinkedMemory.length,
  };
}

export async function listWorkerWorkspaceSnapshots() {
  const [{ workers, source, error }, { tasks }, { approvals }, { entries }] = await Promise.all([
    listWorkers(),
    listTasks(),
    listApprovals(),
    listMemoryEntries(),
  ]);

  return {
    workers,
    snapshots: Object.fromEntries(
      workers.map((worker) => [worker.id, buildWorkerWorkspaceSnapshot(worker, tasks, approvals, entries)]),
    ) as Record<string, WorkerWorkspaceSnapshotDTO>,
    source,
    error,
  };
}

export async function getWorkerWorkspaceSnapshot(workerId: string) {
  const { workers, snapshots } = await listWorkerWorkspaceSnapshots();
  const worker = workers.find((candidate) => candidate.id === workerId) ?? null;

  return {
    worker,
    snapshot: worker ? snapshots[worker.id] : null,
  };
}

export async function getWorkerById(workerId: string) {
  const { workers } = await listWorkers();
  return workers.find((worker: { id: string }) => worker.id === workerId) ?? null;
}
