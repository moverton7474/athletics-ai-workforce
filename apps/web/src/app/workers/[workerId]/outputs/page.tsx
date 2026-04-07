type WorkerOutputsPageProps = {
  params: { workerId: string };
};

export default function WorkerOutputsPage({ params }: WorkerOutputsPageProps) {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Outputs</h1>
      <p>Outputs for worker: {params.workerId}</p>
      <p>This route will show drafts, proposals, reports, or role-specific artifacts.</p>
    </main>
  );
}
