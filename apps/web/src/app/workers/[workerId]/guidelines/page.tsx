import { getWorkerById } from '../../../../lib/services/workers';

type WorkerGuidelinesPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerGuidelinesPage({ params }: WorkerGuidelinesPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Guidelines</h1>
      <p>Guideline fields and role tuning for worker: {workerId}</p>
      {worker ? <p>Role: {worker.roleName}</p> : null}
    </main>
  );
}
