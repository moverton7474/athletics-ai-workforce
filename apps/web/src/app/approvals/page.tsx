export const dynamic = 'force-dynamic';

import { ApprovalList } from '../../components/approvals/ApprovalList';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { getCurrentUserContext } from '../../lib/server/membership';
import { listApprovals } from '../../lib/services/approvals';

export default async function ApprovalsPage() {
  const [{ approvals, source, error }, { memberships }] = await Promise.all([
    listApprovals(),
    getCurrentUserContext(),
  ]);

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Approvals</h1>
      <p>Review, approve, reject, or request changes on sensitive workflow actions.</p>
      <DataSourceNotice source={source} entityLabel="Approvals" error={error} />
      <ApprovalList approvals={approvals} canDecide={canDecide} />
    </main>
  );
}
