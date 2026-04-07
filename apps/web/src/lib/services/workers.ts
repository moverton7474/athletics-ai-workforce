import { mockWorkers } from '../../data/mock-workers';
import { fetchWorkers } from '../supabase-queries';

export async function listWorkers() {
  const result = await fetchWorkers();
  if (result.error || !result.data.length) {
    return mockWorkers;
  }
  return result.data;
}

export async function getWorkerById(workerId: string) {
  const workers = await listWorkers();
  return workers.find((worker: { id: string }) => worker.id === workerId) ?? null;
}
