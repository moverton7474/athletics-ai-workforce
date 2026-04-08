import type { ConnectorRunDTO } from '../../lib/types';

export function ConnectorRunsWidget({ runs }: { runs: ConnectorRunDTO[] }) {
  const latestRuns = runs.slice(0, 5);

  return (
    <section>
      <h2>Latest Connector Outcomes</h2>
      {latestRuns.length ? (
        <ul>
          {latestRuns.map((run) => (
            <li key={run.id}>
              <strong>{run.label}</strong> — {run.status}: {run.summary}
            </li>
          ))}
        </ul>
      ) : (
        <p>No connector outcomes logged yet.</p>
      )}
    </section>
  );
}
