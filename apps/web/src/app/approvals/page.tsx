import { ApprovalList } from '../../components/approvals/ApprovalList';

export default function ApprovalsPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Approvals</h1>
      <p>Approval requests, decisions, and sensitive action gates.</p>
      <ApprovalList />
    </main>
  );
}
