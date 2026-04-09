import type { ApprovalDTO, ConnectorRunDTO, TaskDTO } from '../../lib/types';

export function ConnectorRunsWidget({ runs, approvals, tasks }: { runs: ConnectorRunDTO[]; approvals: ApprovalDTO[]; tasks: TaskDTO[] }) {
  const latestRuns = runs.slice(0, 5);
  const linkedApprovals = approvals.filter((approval) => approval.connectorRunId);
  const linkedTaskIds = new Set<string>();

  linkedApprovals.forEach((approval) => {
    if (approval.taskId) {
      linkedTaskIds.add(approval.taskId);
    }
    if (approval.outcomeTaskId) {
      linkedTaskIds.add(approval.outcomeTaskId);
    }
  });

  const linkedTasks = tasks.filter((task) => linkedTaskIds.has(task.id));
  const awaitingApprovalRuns = runs.filter((run) => run.status === 'awaiting_approval').length;

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Latest Connector Outcomes</h2>
        <p style={{ margin: 0 }}>Connector activity, approval routing, and downstream task signals in one place.</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Connector runs</strong>
          <p style={{ margin: '6px 0 0 0' }}>{runs.length}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Awaiting approval</strong>
          <p style={{ margin: '6px 0 0 0' }}>{awaitingApprovalRuns}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Linked approvals</strong>
          <p style={{ margin: '6px 0 0 0' }}>{linkedApprovals.length}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Linked tasks</strong>
          <p style={{ margin: '6px 0 0 0' }}>{linkedTasks.length}</p>
        </article>
      </div>

      {latestRuns.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
          {latestRuns.map((run) => {
            const runApprovals = linkedApprovals.filter((approval) => approval.connectorRunId === run.id);
            const runTaskIds = new Set<string>();

            runApprovals.forEach((approval) => {
              if (approval.taskId) {
                runTaskIds.add(approval.taskId);
              }
              if (approval.outcomeTaskId) {
                runTaskIds.add(approval.outcomeTaskId);
              }
            });

            const runTasks = tasks.filter((task) => runTaskIds.has(task.id));

            return (
              <li key={run.id}>
                <strong>{run.label}</strong> — {run.status}: {run.summary}
                <div style={{ color: '#555' }}>
                  {runApprovals.length} approval{runApprovals.length === 1 ? '' : 's'} · {runTasks.length} task{runTasks.length === 1 ? '' : 's'}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p style={{ margin: 0 }}>No connector outcomes logged yet.</p>
      )}
    </section>
  );
}
