import type { MemoryEntryDTO, WorkerDTO } from '../../lib/types';

export function PinnedMemoryWidget({ entries, workers }: { entries: MemoryEntryDTO[]; workers: WorkerDTO[] }) {
  const pinnedEntries = entries.filter((entry) => entry.pinned).slice(0, 6);

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
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Pinned Memory</h2>
        <p style={{ margin: 0, color: '#555' }}>High-signal notes that should stay visible at the command-center layer across workers and workflow surfaces.</p>
      </div>
      {pinnedEntries.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {pinnedEntries.map((entry) => (
            <article key={entry.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <strong>{entry.summary ?? entry.content}</strong>
              <div style={{ marginTop: 8, color: '#555' }}>{getWorkerLabel(entry.workerId)}</div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0 }}>No pinned memory yet.</p>
      )}
    </section>
  );
}
