import { ApprovalList } from '../../components/approvals/ApprovalList';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listApprovals } from '../../lib/services/approvals';

export default async function ApprovalsPage() {
  const { approvals, source, error } = await listApprovals();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Approvals</h1>
      <p>Approval requests, decisions, and sensitive action gates.</p>
      <DataSourceNotice source={source} entityLabel="Approvals" error={error} />
      <ApprovalList approvals={approvals} />
    </main>
  );
}
