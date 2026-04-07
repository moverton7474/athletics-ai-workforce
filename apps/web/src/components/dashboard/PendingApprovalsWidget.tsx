type ApprovalSummary = {
  id: string;
  title: string;
  status: string;
};

export function PendingApprovalsWidget({ approvals }: { approvals: ApprovalSummary[] }) {
  return (
    <section>
      <h2>Pending Approvals</h2>
      <ul>
        {approvals.map((approval) => (
          <li key={approval.id}>
            <strong>{approval.title}</strong> — {approval.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
