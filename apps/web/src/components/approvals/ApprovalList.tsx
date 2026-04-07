import { ApprovalActions } from './ApprovalActions';

export function ApprovalList({ approvals }: { approvals: { id: string; title: string; status: string }[] }) {
  return (
    <ul>
      {approvals.map((approval) => (
        <li key={approval.id} style={{ marginBottom: 16 }}>
          <strong>{approval.title}</strong> — {approval.status}
          <ApprovalActions />
        </li>
      ))}
    </ul>
  );
}
