export function ConnectorRunsWidget() {
  const runs = [
    { id: 'run-1', label: 'csos sponsor attrition --json', status: 'success' },
    { id: 'run-2', label: 'csos proposal create', status: 'awaiting_approval' },
  ];

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
