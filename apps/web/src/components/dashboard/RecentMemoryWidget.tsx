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
    <section>
      <h2>Recent Memory</h2>
      {recentEntries.length ? (
        <ul>
          {recentEntries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.summary ?? entry.content}</strong>
              <div>
                {entry.memoryType.replaceAll('_', ' ')} · {entry.visibilityScope.replaceAll('_', ' ')} · {getWorkerLabel(entry.workerId)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent memory captured yet.</p>
      )}
    </section>
  );
}
