type WorkerPageProps = {
  params: { workerId: string };
};

export default function WorkerDetailPage({ params }: WorkerPageProps) {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Workspace</h1>
      <p>Worker ID: {params.workerId}</p>
      <ul>
        <li>Chat</li>
        <li>Outputs</li>
        <li>Guidelines</li>
        <li>Settings</li>
      </ul>
    </main>
  );
}
