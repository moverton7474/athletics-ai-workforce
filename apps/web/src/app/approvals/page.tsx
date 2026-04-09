export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ApprovalList } from '../../components/approvals/ApprovalList';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { getCurrentUserContext } from '../../lib/server/membership';
import { getApprovalQueueState } from '../../lib/voice-route-state';
import { listApprovals } from '../../lib/services/approvals';

export default async function ApprovalsPage() {
  const [{ approvals, source, error }, { memberships }] = await Promise.all([
    listApprovals(),
    getCurrentUserContext(),
  ]);

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));
  const queueState = getApprovalQueueState();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Approvals</h1>
        <p style={{ margin: 0 }}>Review, approve, reject, or request changes on sensitive workflow actions.</p>
      </div>
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Queue State</h2>
        <p style={{ margin: '8px 0' }}>Current filter: {queueState.filter}</p>
        <p style={{ margin: '8px 0' }}>Highlighted approval: {queueState.highlightedApprovalId}</p>
        <p style={{ margin: '8px 0 0' }}>
          This route is the manual + voice inbox for launch-ready and pending approval work.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link href="/approvals/ksu-football-2026-non-renewals-draft-launch-approval?segmentKey=ksu-football-2026-non-renewals">
            Open approval shell example
          </Link>
        </div>
      </section>
      <DataSourceNotice source={source} entityLabel="Approvals" error={error} />
      <ApprovalList approvals={approvals} canDecide={canDecide} />
    </main>
  );
}
