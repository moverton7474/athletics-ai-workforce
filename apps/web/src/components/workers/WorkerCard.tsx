import Link from 'next/link';
import type { WorkerDTO, WorkerWorkspaceSnapshotDTO } from '../../lib/types';

function badgeStyles(kind: 'mode' | 'status') {
  if (kind === 'mode') {
    return { border: '#bfdbfe', background: '#eff6ff', color: '#1d4ed8' };
  }

  return { border: '#bbf7d0', background: '#f0fdf4', color: '#166534' };
}

export function WorkerCard({ worker, snapshot }: { worker: WorkerDTO; snapshot?: WorkerWorkspaceSnapshotDTO | null }) {
  const modeStyles = badgeStyles('mode');
  const statusStyles = badgeStyles('status');

  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>{worker.name}</h2>
          <p style={{ margin: '6px 0 0 0' }}>{worker.roleName}</p>
        </div>
        {snapshot ? (
          <div style={{ maxWidth: 320 }}>
            <strong>{snapshot.ownershipLabel}</strong>
            <p style={{ margin: '6px 0 0 0', color: '#555' }}>{snapshot.accountabilityLabel}</p>
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ border: `1px solid ${modeStyles.border}`, background: modeStyles.background, color: modeStyles.color, borderRadius: 999, padding: '4px 10px' }}>Mode: {worker.mode}</span>
        <span style={{ border: `1px solid ${statusStyles.border}`, background: statusStyles.background, color: statusStyles.color, borderRadius: 999, padding: '4px 10px' }}>Status: {worker.status}</span>
        {snapshot ? <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>{snapshot.navigationLabel}</span> : null}
      </div>
      <p style={{ margin: 0 }}>
        {snapshot?.collaborationSummary ??
          (worker.mode === 'shared'
            ? 'Shared worker: designed for collaborative operating workflows and team-visible actions.'
            : 'Personal worker: designed to support one operator with focused prep, planning, and follow-through.')}
      </p>
      {snapshot ? (
        <section style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
            <strong>Open tasks</strong>
            <p style={{ margin: '6px 0 0 0' }}>{snapshot.openTaskCount}</p>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
            <strong>Pending approvals</strong>
            <p style={{ margin: '6px 0 0 0' }}>{snapshot.pendingApprovalCount}</p>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
            <strong>Linked memory</strong>
            <p style={{ margin: '6px 0 0 0' }}>{snapshot.linkedMemoryCount}</p>
          </div>
          <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12 }}>
            <strong>Pinned memory</strong>
            <p style={{ margin: '6px 0 0 0' }}>{snapshot.pinnedMemoryCount}</p>
          </div>
        </section>
      ) : null}
      {snapshot ? <p style={{ margin: 0, color: '#555' }}>{snapshot.handoffSummary}</p> : null}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/workers/${worker.id}`}>Open workspace</Link>
        <Link href={`/workers/${worker.id}/outputs`}>Outputs</Link>
        <Link href={`/workers/${worker.id}/guidelines`}>Guidelines</Link>
        <Link href={`/workers/${worker.id}/settings`}>Settings</Link>
      </div>
    </article>
  );
}
