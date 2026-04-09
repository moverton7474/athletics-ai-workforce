import Link from 'next/link';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO } from '../../lib/types';
import { MemoryEntryCard } from '../memory/MemoryEntryCard';

export function WorkerContinuityPanel({
  worker,
  tasks,
  approvals,
  memoryEntries,
}: {
  worker: WorkerDTO;
  tasks: TaskDTO[];
  approvals: ApprovalDTO[];
  memoryEntries: MemoryEntryDTO[];
}) {
  const pinnedEntries = memoryEntries.filter((entry) => entry.pinned);

  return (
    <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Continuity & Workflow Context</h3>
        <p style={{ margin: 0 }}>
          Keep {worker.name}&apos;s recent memory, active work, and approval dependencies visible in one place so the next session can resume cleanly.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>Open Tasks</h4>
          {tasks.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                  <div style={{ color: '#555' }}>
                    {task.status.replaceAll('_', ' ')} · {task.priority}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No worker-linked tasks yet.</p>
          )}
        </section>

        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>Pending Approvals</h4>
          {approvals.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {approvals.map((approval) => (
                <li key={approval.id}>
                  <Link href={`/approvals/${approval.id}`}>{approval.title}</Link>
                  <div style={{ color: '#555' }}>
                    {approval.status.replaceAll('_', ' ')}
                    {approval.nextActionLabel ? ` · ${approval.nextActionLabel}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No approval dependencies linked yet.</p>
          )}
        </section>
      </div>

      {pinnedEntries.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Pinned Memory</h4>
            <p style={{ margin: 0 }}>High-signal continuity notes that should stay top-of-mind for this worker.</p>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {pinnedEntries.map((entry) => (
              <MemoryEntryCard key={entry.id} item={entry} />
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>Recent Memory</h4>
          <p style={{ margin: 0 }}>Operator handoffs, worker signals, and process reminders that should survive a context reset.</p>
        </div>
        {memoryEntries.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {memoryEntries.map((entry) => (
              <MemoryEntryCard key={entry.id} item={entry} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>No continuity notes captured yet.</p>
        )}
      </div>
    </section>
  );
}
