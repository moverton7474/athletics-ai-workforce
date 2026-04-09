import Link from 'next/link';
import { MemoryEntryList } from '../../../components/memory/MemoryEntryList';
import { listApprovals } from '../../../lib/services/approvals';
import { listMemoryEntriesForTask, listMemoryEntriesForWorker } from '../../../lib/services/memory';
import { getTaskById } from '../../../lib/services/tasks';

type TaskDetailPageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;
  const task = await getTaskById(taskId);

  if (!task) {
    return (
      <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Link href="/tasks">← Back to tasks</Link>
          <h1 style={{ margin: 0 }}>Task Detail</h1>
        </div>
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0 }}>Task not found.</p>
        </section>
      </main>
    );
  }

  const [{ approvals }, { entries: workerMemoryEntries }, { entries: taskMemoryEntries }] = await Promise.all([
    listApprovals(),
    task.workerId ? listMemoryEntriesForWorker(task.workerId) : Promise.resolve({ entries: [], source: 'mock' as const, error: null }),
    listMemoryEntriesForTask(task.id),
  ]);

  const memoryEntries = [...taskMemoryEntries, ...workerMemoryEntries.filter((entry) => entry.taskId !== task.id)];
  const originApprovals = approvals.filter((approval) => approval.taskId === task.id);
  const outcomeApprovals = approvals.filter((approval) => approval.outcomeTaskId === task.id);
  const pendingOriginApprovals = originApprovals.filter((approval) => approval.status === 'pending');
  const recommendedTaskAction = pendingOriginApprovals.length
    ? 'Review the linked pending approval before advancing this task.'
    : outcomeApprovals.length
      ? 'Review the outcome approval chain and confirm the downstream follow-up stays aligned.'
      : task.status === 'completed'
        ? 'Capture the final operating notes so this work stays durable for the next session.'
        : 'Package the next operator step and attach any missing continuity notes before handoff.';
  const escalationLevel = pendingOriginApprovals.length
    ? 'high'
    : task.priority === 'high' || task.status === 'in_progress'
      ? 'medium'
      : 'low';
  const escalationSummary = pendingOriginApprovals.length
    ? 'This task is blocked behind a pending approval and should stay in view until a decision lands.'
    : task.priority === 'high'
      ? 'This is a high-priority task and should remain near the top of the operator queue.'
      : task.status === 'completed'
        ? 'Execution is complete; the main risk now is losing continuity or final operating notes.'
        : 'No immediate escalation signal is visible, but the next handoff step should still be explicit.';
  const escalationStyles =
    escalationLevel === 'high'
      ? { border: '#fca5a5', background: '#fef2f2' }
      : escalationLevel === 'medium'
        ? { border: '#fdba74', background: '#fff7ed' }
        : { border: '#86efac', background: '#ecfdf3' };

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Link href="/tasks">← Back to tasks</Link>
        <h1 style={{ margin: 0 }}>Task Detail</h1>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>{task.title}</h2>
          <p style={{ margin: 0 }}>Status: {task.status} · Priority: {task.priority}</p>
        </div>
        {task.description ? <p style={{ margin: 0 }}>{task.description}</p> : null}
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {task.workerId ? (
            <li>
              Assigned worker: <Link href={`/workers/${task.workerId}`}>{task.workerId}</Link>
            </li>
          ) : null}
          <li>Organization ID: {task.organizationId}</li>
          <li>Use this surface to package workflow context, approvals, and next-step actions together rather than leaving them scattered.</li>
        </ul>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Operator Next Action</h2>
          <p style={{ margin: 0 }}>{recommendedTaskAction}</p>
        </div>

        <section
          style={{
            border: `1px solid ${escalationStyles.border}`,
            background: escalationStyles.background,
            borderRadius: 12,
            padding: 12,
            display: 'grid',
            gap: 8,
          }}
        >
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Escalation clarity</h3>
            <p style={{ margin: 0 }}>Level: <strong>{escalationLevel}</strong></p>
          </div>
          <p style={{ margin: 0 }}>{escalationSummary}</p>
        </section>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {pendingOriginApprovals[0] ? <Link href={`/approvals/${pendingOriginApprovals[0].id}`}>Open pending approval</Link> : null}
          {task.workerId ? <Link href={`/workers/${task.workerId}`}>Open assigned worker</Link> : null}
          <Link href="/knowledge">Capture continuity note</Link>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Workflow Links</h2>
          <p style={{ margin: 0 }}>Show how this task participates in the approval loop and whether it is an origin task or a downstream follow-up.</p>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Approvals triggered by this task</h3>
            {originApprovals.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
                {originApprovals.map((approval) => (
                  <li key={approval.id}>
                    <Link href={`/approvals/${approval.id}`}>{approval.title}</Link>
                    <div style={{ color: '#555' }}>{approval.status.replaceAll('_', ' ')}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0 }}>No approval records linked as the source task yet.</p>
            )}
          </section>

          <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Follow-up approvals that produced this task</h3>
            {outcomeApprovals.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
                {outcomeApprovals.map((approval) => (
                  <li key={approval.id}>
                    <Link href={`/approvals/${approval.id}`}>{approval.title}</Link>
                    <div style={{ color: '#555' }}>
                      {approval.status.replaceAll('_', ' ')}
                      {approval.decisionNote ? ` · ${approval.decisionNote}` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0 }}>This task is not currently registered as an approval outcome.</p>
            )}
          </section>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Related Memory</h2>
          <p style={{ margin: 0 }}>Recent worker continuity notes that should stay attached to the operating context for this task.</p>
        </div>
        <MemoryEntryList initialEntries={memoryEntries} limit={4} emptyMessage="No related memory captured yet." />
      </section>
    </main>
  );
}
