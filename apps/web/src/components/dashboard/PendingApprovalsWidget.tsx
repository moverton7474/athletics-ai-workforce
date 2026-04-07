import { mockApprovals } from '../../data/mock-approvals';

export function PendingApprovalsWidget() {
  return (
    <section>
      <h2>Pending Approvals</h2>
      <ul>
        {mockApprovals.map((approval) => (
          <li key={approval.id}>
            <strong>{approval.title}</strong> — {approval.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
