import { mockApprovals } from '../../data/mock-approvals';

export function ApprovalList() {
  return (
    <ul>
      {mockApprovals.map((approval) => (
        <li key={approval.id}>
          <strong>{approval.title}</strong> — {approval.status}
        </li>
      ))}
    </ul>
  );
}
