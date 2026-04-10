import Link from 'next/link';
import type { ApprovalDTO } from '../../lib/types';

export function PendingApprovalsWidget({ approvals }: { approvals: ApprovalDTO[] }) {
  const queuedApprovals = approvals.filter((approval) => approval.status === 'pending').slice(0, 5);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Queued Approvals</h2>
        <p style={{ margin: 0, color: '#555' }}>Human-in-the-loop decisions that are currently blocking or governing downstream workflow execution.</p>
      </div>
      {queuedApprovals.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {queuedApprovals.map((approval) => (
            <article key={approval.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <strong>{approval.title}</strong>
                <span style={{ border: '1px solid #fdba74', background: '#fff7ed', borderRadius: 999, padding: '4px 10px' }}>pending</span>
              </div>
              {approval.summary ? <p style={{ margin: 0, color: '#555' }}>{approval.summary}</p> : null}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', color: '#555' }}>
                {approval.entityName ? <span>Entity: {approval.entityName}</span> : null}
                {approval.requestedAction ? <span>Action: {approval.requestedAction.replaceAll('_', ' ')}</span> : null}
                {approval.nextActionLabel ? <span>Next: {approval.nextActionLabel}</span> : null}
              </div>
              <div>
                <Link href={`/approvals/${approval.id}`}>Open review</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0 }}>No queued approvals right now.</p>
      )}
    </section>
  );
}
