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
    <section>
      <h2>Pinned Memory</h2>
      {pinnedEntries.length ? (
        <ul>
          {pinnedEntries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.summary ?? entry.content}</strong>
              <div>{getWorkerLabel(entry.workerId)}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pinned memory yet.</p>
      )}
    </section>
  );
}
