import { mockWorkers } from '../../data/mock-workers';
import { fetchWorkers } from '../supabase-queries';

export async function listWorkers() {
  const result = await fetchWorkers();
  if (result.error || !result.data.length) {
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

export async function getWorkerById(workerId: string) {
  const { workers } = await listWorkers();
  return workers.find((worker: { id: string }) => worker.id === workerId) ?? null;
}
