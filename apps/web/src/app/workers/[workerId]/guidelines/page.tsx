type WorkerGuidelinesPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerGuidelinesPage({ params }: WorkerGuidelinesPageProps) {
  const { workerId } = await params;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Guidelines</h1>
      <p>Guideline fields and role tuning for worker: {workerId}</p>
    </main>
  );
}
