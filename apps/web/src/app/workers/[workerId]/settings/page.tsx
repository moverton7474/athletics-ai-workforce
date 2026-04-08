import { getWorkerWorkspaceContent } from '../../../../data/mock-worker-workspace';
import { WorkerWorkspaceShell } from '../../../../components/workers/WorkerWorkspaceShell';
import { getWorkerById } from '../../../../lib/services/workers';

type WorkerSettingsPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerSettingsPage({ params }: WorkerSettingsPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  if (!worker) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>Worker Settings</h1>
        <p>Worker not found.</p>
      </main>
    );
  }

  const content = getWorkerWorkspaceContent(worker);

  return (
    <WorkerWorkspaceShell worker={worker} activeTab="settings">
      <section style={{ display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Worker Settings</h2>
          <p style={{ margin: 0 }}>Assignment mode, integration posture, and future runtime controls should live here.</p>
        </div>
        <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
          {content.settings.map((item) => (
            <div key={item.label} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
              <dt style={{ fontWeight: 700 }}>{item.label}</dt>
              <dd style={{ margin: '6px 0 0 0' }}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </WorkerWorkspaceShell>
  );
}
