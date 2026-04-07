type WorkerGuidelinesPageProps = {
  params: { workerId: string };
};

export default function WorkerGuidelinesPage({ params }: WorkerGuidelinesPageProps) {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Guidelines</h1>
      <p>Guideline fields and role tuning for worker: {params.workerId}</p>
    </main>
  );
}
