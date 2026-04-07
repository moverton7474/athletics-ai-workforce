import type { WorkerDTO } from '@athletics-ai-workforce/shared';

export function WorkerCard({ worker }: { worker: WorkerDTO }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
      <h2>{worker.name}</h2>
      <p>{worker.roleName}</p>
      <p>Mode: {worker.mode}</p>
      <p>Status: {worker.status}</p>
    </article>
  );
}
