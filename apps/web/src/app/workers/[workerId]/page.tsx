type WorkerPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerDetailPage({ params }: WorkerPageProps) {
  const { workerId } = await params;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Workspace</h1>
      <p>Worker ID: {workerId}</p>
      <ul>
        <li>Chat</li>
        <li>Outputs</li>
        <li>Guidelines</li>
        <li>Settings</li>
      </ul>
    </main>
  );
}
