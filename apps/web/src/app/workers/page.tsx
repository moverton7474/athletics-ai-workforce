import { mockWorkers } from '../../data/mock-workers';
import { WorkerCard } from '../../components/workers/WorkerCard';

export default function WorkersPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Workers</h1>
      <p>Shared and personal workers available in this organization.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {mockWorkers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </main>
  );
}
