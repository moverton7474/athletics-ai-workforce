import { getWorkerById } from '../../../../lib/services/workers';

type WorkerSettingsPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerSettingsPage({ params }: WorkerSettingsPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Settings</h1>
      <p>Integrations, assignment mode, and worker configuration for: {workerId}</p>
      {worker ? <p>Role: {worker.roleName}</p> : null}
    </main>
  );
}
