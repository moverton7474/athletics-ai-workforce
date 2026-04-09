'use client';

import { useMemo, useState } from 'react';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO } from '../../lib/types';
import { MemoryCaptureForm } from '../memory/MemoryCaptureForm';
import { MemoryEntryCard } from '../memory/MemoryEntryCard';

function sortEntries(entries: MemoryEntryDTO[]) {
  return [...entries].sort((left, right) => {
    const pinnedDelta = Number(right.pinned === true) - Number(left.pinned === true);
    if (pinnedDelta !== 0) {
      return pinnedDelta;
    }

    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

export function KnowledgeMemorySection({
  initialEntries,
  workers,
  tasks,
  approvals,
}: {
  initialEntries: MemoryEntryDTO[];
  workers: WorkerDTO[];
  tasks: TaskDTO[];
  approvals: ApprovalDTO[];
}) {
  const [entries, setEntries] = useState(() => sortEntries(initialEntries));
  const feedEntries = useMemo(() => sortEntries(entries).slice(0, 6), [entries]);

  return (
    <>
      <section style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Capture Memory</h2>
            <p style={{ margin: 0 }}>Write continuity notes directly into the backend so handoffs and reminders survive context resets.</p>
          </div>
          <MemoryCaptureForm
            workers={workers.map((worker) => ({ id: worker.id, name: worker.name, roleName: worker.roleName }))}
            tasks={tasks.map((task) => ({ id: task.id, title: task.title }))}
            approvals={approvals.map((approval) => ({ id: approval.id, title: approval.title }))}
            refreshOnSuccess
            onCreated={(entry) => {
              if (!entry) {
                return;
              }

              setEntries((current) => sortEntries([entry, ...current.filter((currentEntry) => currentEntry.id !== entry.id)]));
            }}
          />
        </section>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recent Continuity Feed</h2>
          <p style={{ margin: 0 }}>Recent memory entries that keep tasks, handoffs, and operator guidance from disappearing between sessions.</p>
        </div>
        {feedEntries.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {feedEntries.map((entry) => (
              <MemoryEntryCard
                key={entry.id}
                item={entry}
                onUpdated={(updatedEntry) => {
                  setEntries((current) => sortEntries(current.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))));
                }}
                onDeleted={(deletedEntryId) => {
                  setEntries((current) => current.filter((entry) => entry.id !== deletedEntryId));
                }}
              />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>No memory entries captured yet.</p>
        )}
      </section>
    </>
  );
}
