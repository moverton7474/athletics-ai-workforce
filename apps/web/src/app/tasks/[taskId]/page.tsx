import Link from 'next/link';
import { MemoryEntryCard } from '../../../components/memory/MemoryEntryCard';
import { listApprovals } from '../../../lib/services/approvals';
import { listMemoryEntriesForWorker } from '../../../lib/services/memory';
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

  const [{ approvals }, { entries: memoryEntries }] = await Promise.all([
    listApprovals(),
    task.workerId ? listMemoryEntriesForWorker(task.workerId) : Promise.resolve({ entries: [], source: 'mock' as const, error: null }),
  ]);

  const originApprovals = approvals.filter((approval) => approval.taskId === task.id);
  const outcomeApprovals = approvals.filter((approval) => approval.outcomeTaskId === task.id);

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
        {memoryEntries.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {memoryEntries.slice(0, 4).map((entry) => (
              <MemoryEntryCard key={entry.id} item={entry} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>No related memory captured yet.</p>
        )}
      </section>
    </main>
  );
}
