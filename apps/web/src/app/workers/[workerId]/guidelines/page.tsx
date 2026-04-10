import { getWorkerWorkspaceContent } from '../../../../data/mock-worker-workspace';
import { WorkerWorkspaceShell } from '../../../../components/workers/WorkerWorkspaceShell';
import { getWorkerWorkspaceSnapshot } from '../../../../lib/services/workers';

type WorkerGuidelinesPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerGuidelinesPage({ params }: WorkerGuidelinesPageProps) {
  const { workerId } = await params;
  const { worker, snapshot } = await getWorkerWorkspaceSnapshot(workerId);

  if (!worker) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Worker Guidelines</h1>
        <p>Worker not found.</p>
      </main>
    );
  }

  const content = getWorkerWorkspaceContent(worker);

  return (
    <WorkerWorkspaceShell worker={worker} activeTab="guidelines" snapshot={snapshot}>
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Role Guidelines</h2>
          <p style={{ margin: 0 }}>This surface should become the structured tuning layer for how the worker operates.</p>
        </div>
        {snapshot ? (
          <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Operating posture</h3>
            <p style={{ margin: '0 0 8px 0' }}>{snapshot.collaborationSummary}</p>
            <p style={{ margin: 0, color: '#555' }}>Guidelines should reinforce ownership boundaries, handoff clarity, and what this worker is allowed to surface into team-visible workflows.</p>
          </section>
        ) : null}
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          {content.guidelines.map((guideline) => (
            <li key={guideline}>{guideline}</li>
          ))}
        </ul>
      </section>
    </WorkerWorkspaceShell>
  );
}
