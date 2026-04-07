type WorkerSettingsPageProps = {
  params: { workerId: string };
};

export default function WorkerSettingsPage({ params }: WorkerSettingsPageProps) {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Worker Settings</h1>
      <p>Integrations, assignment mode, and worker configuration for: {params.workerId}</p>
    </main>
  );
}
