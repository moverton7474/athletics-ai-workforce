import Link from 'next/link';
import type { ApprovalDTO } from '../../lib/types';

export function PendingApprovalsWidget({ approvals }: { approvals: ApprovalDTO[] }) {
  const queuedApprovals = approvals.filter((approval) => approval.status === 'pending').slice(0, 5);

  return (
    <section>
      <h2>Queued Approvals</h2>
      {queuedApprovals.length ? (
        <ul>
          {queuedApprovals.map((approval) => (
            <li key={approval.id}>
              <strong>{approval.title}</strong>
              {approval.summary ? ` — ${approval.summary}` : ''}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href={`/approvals/${approval.id}`}>Open review</Link>
                {approval.entityName ? <span>Entity: {approval.entityName}</span> : null}
                {approval.requestedAction ? <span>Action: {approval.requestedAction.replaceAll('_', ' ')}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No queued approvals right now.</p>
      )}
    </section>
  );
}
