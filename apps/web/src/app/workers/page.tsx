export const dynamic = 'force-dynamic';

import { WorkerCard } from '../../components/workers/WorkerCard';
import { WorkerModeGuide } from '../../components/workers/WorkerModeGuide';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listWorkerWorkspaceSnapshots } from '../../lib/services/workers';

export default async function WorkersPage() {
  const { workers, snapshots, source, error } = await listWorkerWorkspaceSnapshots();
  const sharedWorkers = workers.filter((worker) => worker.mode === 'shared');
  const personalWorkers = workers.filter((worker) => worker.mode === 'personal');

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Workers</h1>
        <p style={{ margin: 0 }}>Shared and personal workers available in this organization.</p>
      </div>
      <DataSourceNotice source={source} entityLabel="Workers" error={error} />
      <WorkerModeGuide />
      <section style={{ display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Shared Workers</h2>
          <p style={{ margin: 0 }}>Team-facing workers for collaborative workflows, governed actions, and common operating surfaces.</p>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {sharedWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} snapshot={snapshots[worker.id]} />
          ))}
        </div>
      </section>
      <section style={{ display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Personal Workers</h2>
          <p style={{ margin: 0 }}>Operator-specific workers that package context, prep work, and focused support.</p>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {personalWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} snapshot={snapshots[worker.id]} />
          ))}
        </div>
      </section>
    </main>
  );
}
