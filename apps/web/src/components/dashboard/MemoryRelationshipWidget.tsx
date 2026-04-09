import Link from 'next/link';
import type { ApprovalDTO, MemoryEntryDTO, TaskDTO, WorkerDTO } from '../../lib/types';

type CoverageBucket = {
  key: 'tasks' | 'approvals' | 'workers';
  label: string;
  linkedLabel: string;
  total: number;
  covered: number;
  uncovered: number;
  href: string;
};

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

  const uncoveredTasks = openTasks.filter((task) => !taskLinkedIds.has(task.id));
  const uncoveredApprovals = pendingApprovals.filter((approval) => !approvalLinkedIds.has(approval.id));
  const uncoveredWorkers = activeWorkers.filter((worker) => !workerLinkedIds.has(worker.id));

  const coverage: CoverageBucket[] = [
    {
      key: 'tasks',
      label: 'Open Tasks',
      linkedLabel: 'open tasks linked to memory',
      total: openTasks.length,
      covered: Math.min(taskLinkedIds.size, openTasks.length),
      uncovered: uncoveredTasks.length,
      href: '/tasks',
    },
    {
      key: 'approvals',
      label: 'Pending Approvals',
      linkedLabel: 'pending approvals linked to memory',
      total: pendingApprovals.length,
      covered: Math.min(approvalLinkedIds.size, pendingApprovals.length),
      uncovered: uncoveredApprovals.length,
      href: '/approvals',
    },
    {
      key: 'workers',
      label: 'Workers',
      linkedLabel: 'active workers linked to memory',
      total: activeWorkers.length,
      covered: Math.min(workerLinkedIds.size, activeWorkers.length),
      uncovered: uncoveredWorkers.length,
      href: '/workers',
    },
  ];

  const attentionQueue = [
    ...uncoveredApprovals.slice(0, 2).map((approval) => ({
      id: approval.id,
      title: approval.title,
      subtitle: 'Pending approval missing continuity context',
      href: `/approvals/${approval.id}`,
      actionLabel: 'Review approval',
    })),
    ...uncoveredTasks.slice(0, 2).map((task) => ({
      id: task.id,
      title: task.title,
      subtitle: 'Open task missing linked memory',
      href: `/tasks/${task.id}`,
      actionLabel: 'Open task',
    })),
    ...uncoveredWorkers.slice(0, 2).map((worker) => ({
      id: worker.id,
      title: worker.name,
      subtitle: 'Active worker missing continuity notes',
      href: `/workers/${worker.id}`,
      actionLabel: 'Open workspace',
    })),
  ].slice(0, 6);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Continuity Coverage</h2>
        <p style={{ margin: 0 }}>Shows how much live work has memory attached, and where continuity is still thin.</p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {coverage.map((bucket) => {
          const percentage = bucket.total > 0 ? Math.round((bucket.covered / bucket.total) * 100) : 100;

          return (
            <section key={bucket.key} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14, display: 'grid', gap: 10 }}>
              <div>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>{bucket.label}</h3>
                <p style={{ margin: 0 }}>
                  {bucket.covered} / {bucket.total} {bucket.linkedLabel}
                </p>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: 999, overflow: 'hidden', height: 10 }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: percentage === 100 ? '#16a34a' : percentage >= 50 ? '#2563eb' : '#f59e0b',
                  }}
                />
              </div>
              <p style={{ margin: 0, color: '#555' }}>
                {bucket.uncovered === 0 ? 'Fully covered' : `${bucket.uncovered} still missing continuity notes`}
              </p>
              <Link href={bucket.href}>Open {bucket.label.toLowerCase()}</Link>
            </section>
          );
        })}
      </div>

      <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14, display: 'grid', gap: 12 }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Resolve Next</h3>
          <p style={{ margin: 0 }}>Prioritized continuity gaps so operators can close missing context without hunting through the product.</p>
        </div>
        {attentionQueue.length ? (
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
            {attentionQueue.map((item) => (
              <li key={item.id}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong>{item.title}</strong>
                  <span style={{ color: '#555' }}>{item.subtitle}</span>
                  <Link href={item.href}>{item.actionLabel}</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0 }}>No active continuity gaps right now.</p>
        )}
      </section>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Tasks needing continuity</h3>
          {uncoveredTasks.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {uncoveredTasks.slice(0, 4).map((task) => (
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
              {uncoveredApprovals.slice(0, 4).map((approval) => (
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
              {uncoveredWorkers.slice(0, 4).map((worker) => (
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
