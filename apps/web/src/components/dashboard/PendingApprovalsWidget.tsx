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
            </li>
          ))}
        </ul>
      ) : (
        <p>No queued approvals right now.</p>
      )}
    </section>
  );
}
