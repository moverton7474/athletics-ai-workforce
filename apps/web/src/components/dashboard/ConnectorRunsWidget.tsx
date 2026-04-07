type ConnectorRunSummary = {
  id: string;
  label: string;
  status: string;
};

export function ConnectorRunsWidget({ runs }: { runs: ConnectorRunSummary[] }) {
  return (
    <section>
      <h2>Connector Runs</h2>
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <strong>{run.label}</strong> — {run.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
