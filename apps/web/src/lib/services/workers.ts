import { mockWorkers } from '../../data/mock-workers';

export async function listWorkers() {
  return mockWorkers;
}

export async function getWorkerById(workerId: string) {
  return mockWorkers.find((worker) => worker.id === workerId) ?? null;
}
