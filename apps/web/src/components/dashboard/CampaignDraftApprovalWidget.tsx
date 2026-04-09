import Link from 'next/link';
import type { CampaignDraftRecordDTO } from '../../lib/types';

export function CampaignDraftApprovalWidget({ drafts }: { drafts: CampaignDraftRecordDTO[] }) {
  const awaiting = drafts.filter((draft) => draft.status === 'awaiting_approval');
  const decided = drafts.filter((draft) => ['approved_for_launch', 'changes_requested', 'rejected'].includes(draft.status));
  const latest = drafts.slice(0, 5);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Campaign Draft Approval State</h2>
        <p style={{ margin: 0 }}>Quick read on which campaign drafts are waiting on approval decisions versus already decided.</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Total drafts</strong>
          <p style={{ margin: '6px 0 0 0' }}>{drafts.length}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Awaiting approval</strong>
          <p style={{ margin: '6px 0 0 0' }}>{awaiting.length}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Decided drafts</strong>
          <p style={{ margin: '6px 0 0 0' }}>{decided.length}</p>
        </article>
      </div>

      {latest.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
          {latest.map((draft) => {
            const details = draft.details && typeof draft.details === 'object' ? draft.details : {};
            const approvalStatus = typeof details.approvalStatus === 'string' ? details.approvalStatus : 'not submitted';
            const approvalRoute = typeof details.nextApprovalRoute === 'string' ? details.nextApprovalRoute : null;

            return (
              <li key={draft.draftKey}>
                <strong>{draft.title}</strong>
                <div style={{ color: '#555' }}>
                  Draft: {draft.status.replaceAll('_', ' ')} · Approval: {approvalStatus.replaceAll('_', ' ')}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Link href={`/campaigns/drafts/${draft.draftKey}/review?segmentKey=${draft.segmentKey}`}>Open review</Link>
                  {approvalRoute ? <Link href={approvalRoute}>Open approval</Link> : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p style={{ margin: 0 }}>No campaign drafts recorded yet.</p>
      )}
    </section>
  );
}
