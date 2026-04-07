type WorkerSettingsPageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function WorkerSettingsPage({ params }: WorkerSettingsPageProps) {
  const { workerId } = await params;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Settings</h1>
      <p>Integrations, assignment mode, and worker configuration for: {workerId}</p>
    </main>
  );
}
