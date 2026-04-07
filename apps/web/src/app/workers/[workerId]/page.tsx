import { getWorkerById } from '../../../lib/services/workers';

type WorkerPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerDetailPage({ params }: WorkerPageProps) {
  const { workerId } = await params;
  const worker = await getWorkerById(workerId);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Workspace</h1>
      <p>Worker ID: {workerId}</p>
      {worker ? (
        <>
          <p>Name: {worker.name}</p>
          <p>Role: {worker.roleName}</p>
          <p>Mode: {worker.mode}</p>
        </>
      ) : (
        <p>Worker not found.</p>
      )}
      <ul>
        <li>Chat</li>
        <li>Outputs</li>
        <li>Guidelines</li>
        <li>Settings</li>
      </ul>
    </main>
  );
}
