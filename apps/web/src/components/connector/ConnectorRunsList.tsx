import Link from 'next/link';
import { listApprovals } from '../../lib/services/approvals';
import { listConnectorRuns } from '../../lib/services/connector-runs';
import { listTasks } from '../../lib/services/tasks';

export async function ConnectorRunsList() {
  const [{ runs, source, error }, { approvals }, { tasks }] = await Promise.all([listConnectorRuns(), listApprovals(), listTasks()]);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Connector run history</h2>
        <p style={{ margin: 0 }}>{source === 'supabase' ? 'Live connector history from Supabase.' : 'Fallback connector history.'}</p>
        {error ? <p style={{ marginBottom: 0 }}>{error}</p> : null}
      </div>
      {runs.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {runs.map((run) => {
            const linkedApprovals = approvals.filter((approval) => approval.connectorRunId === run.id);
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
            const lineageSummary = linkedApprovals.length
              ? `${linkedApprovals.length} linked approval${linkedApprovals.length === 1 ? '' : 's'} · ${linkedTasks.length} linked task${linkedTasks.length === 1 ? '' : 's'}`
              : 'No linked approvals or tasks yet.';

            return (
              <article key={run.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, display: 'grid', gap: 12 }}>
                <div>
                  <strong>{run.label}</strong>
                  <p style={{ margin: '6px 0' }}>Status: {run.status}</p>
                  <p style={{ margin: '6px 0' }}>Summary: {run.summary}</p>
                  {run.createdAt ? <p style={{ margin: '6px 0 0 0' }}>Created: {run.createdAt}</p> : null}
                </div>

                <section style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12, display: 'grid', gap: 10 }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: 8 }}>Workflow lineage</h3>
                    <p style={{ margin: 0 }}>{lineageSummary}</p>
                  </div>

                  {linkedApprovals.length ? (
                    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                      <section style={{ border: '1px solid #f7f7f7', borderRadius: 10, padding: 10 }}>
                        <h4 style={{ marginTop: 0, marginBottom: 8 }}>Linked approvals</h4>
                        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
                          {linkedApprovals.map((approval) => (
                            <li key={approval.id}>
                              <Link href={`/approvals/${approval.id}`}>{approval.title}</Link>
                              <div style={{ color: '#555' }}>{approval.status.replaceAll('_', ' ')}</div>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section style={{ border: '1px solid #f7f7f7', borderRadius: 10, padding: 10 }}>
                        <h4 style={{ marginTop: 0, marginBottom: 8 }}>Linked tasks</h4>
                        {linkedTasks.length ? (
                          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
                            {linkedTasks.map((task) => (
                              <li key={task.id}>
                                <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                                <div style={{ color: '#555' }}>{task.status.replaceAll('_', ' ')} · {task.priority}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ margin: 0 }}>No tasks linked yet.</p>
                        )}
                      </section>
                    </div>
                  ) : null}
                </section>

                {run.detail ? <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{run.detail}</pre> : null}
              </article>
            );
          })}
        </div>
      ) : (
        <p style={{ margin: 0 }}>No connector runs yet.</p>
      )}
    </section>
  );
}
