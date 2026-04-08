import { getWorkerWorkspaceContent } from '../../../../data/mock-worker-workspace';
import { WorkerWorkspaceShell } from '../../../../components/workers/WorkerWorkspaceShell';
import { getWorkerById } from '../../../../lib/services/workers';

type WorkerOutputsPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerOutputsPage({ params }: WorkerOutputsPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  if (!worker) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Worker Outputs</h1>
        <p>Worker not found.</p>
      </main>
    );
  }

  const content = getWorkerWorkspaceContent(worker);

  return (
    <WorkerWorkspaceShell worker={worker} activeTab="outputs">
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recent Outputs</h2>
          <p style={{ margin: 0 }}>Role-specific drafts, analyses, and artifacts should collect here for easy review.</p>
        </div>
        {content.recentOutputs.map((output) => (
          <article key={output.title} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <strong>{output.title}</strong>
            <p style={{ margin: '8px 0 0 0' }}>Type: {output.type} · Status: {output.status}</p>
            <p style={{ marginBottom: 0 }}>{output.summary}</p>
          </article>
        ))}
      </section>
    </WorkerWorkspaceShell>
  );
}
