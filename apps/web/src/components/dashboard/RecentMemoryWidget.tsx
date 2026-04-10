import type { MemoryEntryDTO, WorkerDTO } from '../../lib/types';

export function RecentMemoryWidget({
  entries,
  workers,
}: {
  entries: MemoryEntryDTO[];
  workers: WorkerDTO[];
}) {
  const recentEntries = entries.slice(0, 6);

  function getWorkerLabel(workerId?: string | null) {
    if (!workerId) {
      return 'General';
    }

    const worker = workers.find((item) => item.id === workerId);
    return worker ? `${worker.name} (${worker.roleName})` : workerId;
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recent Memory</h2>
        <p style={{ margin: 0, color: '#555' }}>Latest continuity notes, reminders, and context captures that should stay close to current operator work.</p>
      </div>
      {recentEntries.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {recentEntries.map((entry) => (
            <article key={entry.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>{entry.summary ?? entry.content}</strong>
              <div style={{ marginTop: 8, color: '#555' }}>
                {entry.memoryType.replaceAll('_', ' ')} · {entry.visibilityScope.replaceAll('_', ' ')} · {getWorkerLabel(entry.workerId)}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0 }}>No recent memory captured yet.</p>
      )}
    </section>
  );
}
