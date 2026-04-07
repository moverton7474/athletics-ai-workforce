import { listConnectorRuns } from '../../lib/services/connector-runs';

export async function ConnectorRunsList() {
  const { runs, source, error } = await listConnectorRuns();

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>Connector run history</h2>
      <p>{source === 'supabase' ? 'Live connector history from Supabase.' : 'Fallback connector history.'}</p>
      {error ? <p>{error}</p> : null}
      {runs.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {runs.map((run) => (
            <article key={run.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
              <strong>{run.label}</strong>
              <p style={{ margin: '6px 0' }}>Status: {run.status}</p>
              <p style={{ margin: '6px 0' }}>Summary: {run.summary}</p>
              {run.detail ? <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{run.detail}</pre> : null}
            </article>
          ))}
        </div>
      ) : (
        <p>No connector runs yet.</p>
      )}
    </section>
  );
}
