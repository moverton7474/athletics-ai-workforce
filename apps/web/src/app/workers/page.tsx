import { WorkerCard } from '../../components/workers/WorkerCard';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listWorkers } from '../../lib/services/workers';

export default async function WorkersPage() {
  const { workers, source, error } = await listWorkers();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Workers</h1>
      <p>Shared and personal workers available in this organization.</p>
      <DataSourceNotice source={source} entityLabel="Workers" error={error} />
      <div style={{ display: 'grid', gap: 16 }}>
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </main>
  );
}
