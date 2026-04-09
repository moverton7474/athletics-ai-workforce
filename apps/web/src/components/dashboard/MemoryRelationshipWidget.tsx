import Link from 'next/link';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO } from '../../lib/types';

export function MemoryRelationshipWidget({
  entries,
  tasks,
  approvals,
  workers,
}: {
  entries: MemoryEntryDTO[];
  tasks: TaskDTO[];
  approvals: ApprovalDTO[];
  workers: WorkerDTO[];
}) {
  const openTasks = tasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled');
  const pendingApprovals = approvals.filter((approval) => approval.status === 'pending');
  const activeWorkers = workers.filter((worker) => worker.status === 'active');

  const taskLinkedIds = new Set(entries.flatMap((entry) => (entry.taskId ? [entry.taskId] : [])));
  const approvalLinkedIds = new Set(entries.flatMap((entry) => (entry.approvalId ? [entry.approvalId] : [])));
  const workerLinkedIds = new Set(entries.flatMap((entry) => (entry.workerId ? [entry.workerId] : [])));

  const uncoveredTasks = openTasks.filter((task) => !taskLinkedIds.has(task.id)).slice(0, 4);
  const uncoveredApprovals = pendingApprovals.filter((approval) => !approvalLinkedIds.has(approval.id)).slice(0, 4);
  const uncoveredWorkers = activeWorkers.filter((worker) => !workerLinkedIds.has(worker.id)).slice(0, 4);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Continuity Coverage</h2>
        <p style={{ margin: 0 }}>Shows how much live work has memory attached, and where continuity is still thin.</p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Tasks</h3>
          <p style={{ margin: 0 }}>
            {Math.min(taskLinkedIds.size, openTasks.length)} / {openTasks.length} open tasks linked to memory
          </p>
        </section>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Approvals</h3>
          <p style={{ margin: 0 }}>
            {Math.min(approvalLinkedIds.size, pendingApprovals.length)} / {pendingApprovals.length} pending approvals linked to memory
          </p>
        </section>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Workers</h3>
          <p style={{ margin: 0 }}>
            {Math.min(workerLinkedIds.size, activeWorkers.length)} / {activeWorkers.length} active workers linked to memory
          </p>
        </section>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Tasks needing continuity</h3>
          {uncoveredTasks.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {uncoveredTasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Open tasks all have linked memory.</p>
          )}
        </section>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Approvals needing continuity</h3>
          {uncoveredApprovals.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {uncoveredApprovals.map((approval) => (
                <li key={approval.id}>
                  <Link href={`/approvals/${approval.id}`}>{approval.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Pending approvals all have linked memory.</p>
          )}
        </section>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Workers needing continuity</h3>
          {uncoveredWorkers.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {uncoveredWorkers.map((worker) => (
                <li key={worker.id}>
                  <Link href={`/workers/${worker.id}`}>{worker.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Active workers all have linked memory.</p>
          )}
        </section>
      </div>
    </section>
  );
}
