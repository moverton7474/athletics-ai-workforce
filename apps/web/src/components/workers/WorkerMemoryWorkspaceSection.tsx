'use client';

import { useState } from 'react';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO } from '../../lib/types';
import { MemoryCaptureForm } from '../memory/MemoryCaptureForm';
import { WorkerContinuityPanel } from './WorkerContinuityPanel';

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

export function WorkerMemoryWorkspaceSection({
  worker,
  tasks,
  approvals,
  initialMemoryEntries,
}: {
  worker: WorkerDTO;
  tasks: TaskDTO[];
  approvals: ApprovalDTO[];
  initialMemoryEntries: MemoryEntryDTO[];
}) {
  const [memoryEntries, setMemoryEntries] = useState(() => sortEntries(initialMemoryEntries));
  const [panelVersion, setPanelVersion] = useState(0);

  return (
    <>
      <WorkerContinuityPanel key={panelVersion} worker={worker} tasks={tasks} approvals={approvals} memoryEntries={memoryEntries} />
      <section style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Capture Worker Memory</h3>
          <p style={{ margin: 0 }}>
            Save handoffs, signals, and operator notes directly against {worker.name} so continuity can be captured inside the workspace where the work happens.
          </p>
        </div>
        <MemoryCaptureForm
          workers={[{ id: worker.id, name: worker.name, roleName: worker.roleName }]}
          tasks={tasks.map((task) => ({ id: task.id, title: task.title }))}
          approvals={approvals.map((approval) => ({ id: approval.id, title: approval.title }))}
          initialWorkerId={worker.id}
          lockWorker
          refreshOnSuccess
          onCreated={(entry) => {
            if (!entry) {
              return;
            }

            setMemoryEntries((current) => sortEntries([entry, ...current.filter((currentEntry) => currentEntry.id !== entry.id)]));
            setPanelVersion((current) => current + 1);
          }}
        />
      </section>
    </>
  );
}
