import Link from 'next/link';

export function CampaignWorkflowStatusCard({
  draftStatus,
  approvalStatus,
  workflowState,
  latestApprovalNote,
  approvalDecidedAt,
  outcomeTaskId,
  reviewRoute,
  approvalRoute,
  resultsRoute,
  followUpRoute,
}: {
  draftStatus: string;
  approvalStatus?: string;
  workflowState?: string;
  latestApprovalNote?: string;
  approvalDecidedAt?: string;
  outcomeTaskId?: string;
  reviewRoute?: string;
  approvalRoute?: string;
  resultsRoute?: string;
  followUpRoute?: string;
}) {
  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Workflow Status</h2>
        <p style={{ margin: 0 }}>Shared status block so draft review, approvals, results, and follow-up all show the same campaign workflow truth.</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Draft status</strong>
          <p style={{ margin: '6px 0 0 0' }}>{draftStatus.replaceAll('_', ' ')}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Approval status</strong>
          <p style={{ margin: '6px 0 0 0' }}>{(approvalStatus ?? 'not_submitted').replaceAll('_', ' ')}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Workflow state</strong>
          <p style={{ margin: '6px 0 0 0' }}>{(workflowState ?? 'draft_review').replaceAll('_', ' ')}</p>
        </article>
        <article style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <strong>Decision time</strong>
          <p style={{ margin: '6px 0 0 0' }}>{approvalDecidedAt ?? 'Not decided yet'}</p>
        </article>
      </div>

      {latestApprovalNote ? (
        <section style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Latest approval note</h3>
          <p style={{ margin: 0 }}>{latestApprovalNote}</p>
        </section>
      ) : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {reviewRoute ? <Link href={reviewRoute}>Open draft review</Link> : null}
        {approvalRoute ? <Link href={approvalRoute}>Open linked approval</Link> : null}
        {resultsRoute ? <Link href={resultsRoute}>Open results</Link> : null}
        {followUpRoute ? <Link href={followUpRoute}>Open follow-up</Link> : null}
        {outcomeTaskId ? <Link href={`/tasks/${outcomeTaskId}`}>Open outcome task</Link> : null}
      </div>
    </section>
  );
}
