import { listConnectorRuns } from '../../lib/services/connector-runs';

export async function RecentConnectorRunsPanel() {
  const { runs, source, error } = await listConnectorRuns();

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>Recent connector runs</h2>
      <p>{source === 'supabase' ? 'Live connector activity from Supabase.' : 'Fallback connector activity.'}</p>
      {error ? <p>{error}</p> : null}
      {runs.length ? (
        <ul>
          {runs.slice(0, 5).map((run) => (
            <li key={run.id} style={{ marginBottom: 12 }}>
              <strong>{run.label}</strong> — {run.status}
              <p style={{ margin: '4px 0 0 0' }}>{run.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No connector runs yet.</p>
      )}
    </section>
  );
}
