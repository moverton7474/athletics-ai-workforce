import { getWorkerById } from '../../../../lib/services/workers';

type WorkerOutputsPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerOutputsPage({ params }: WorkerOutputsPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Outputs</h1>
      <p>Outputs for worker: {workerId}</p>
      {worker ? <p>Role: {worker.roleName}</p> : null}
      <p>This route will show drafts, proposals, reports, or role-specific artifacts.</p>
    </main>
  );
}
