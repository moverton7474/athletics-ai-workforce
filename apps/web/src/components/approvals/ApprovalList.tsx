import { mockApprovals } from '../../data/mock-approvals';
import { ApprovalActions } from './ApprovalActions';

export function ApprovalList() {
  return (
    <ul>
      {mockApprovals.map((approval) => (
        <li key={approval.id} style={{ marginBottom: 16 }}>
          <strong>{approval.title}</strong> — {approval.status}
          <ApprovalActions />
        </li>
      ))}
    </ul>
  );
}
