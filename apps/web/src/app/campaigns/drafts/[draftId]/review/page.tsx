import Link from 'next/link';
import { CampaignDraftPersistencePanel } from '../../../../../components/campaigns/CampaignDraftPersistencePanel';
import { CampaignReviewSummaryEditor } from '../../../../../components/campaigns/CampaignReviewSummaryEditor';
import { DataSourceNotice } from '../../../../../components/system/DataSourceNotice';
import { getCampaignReviewForRouteState } from '../../../../../lib/services/route-state';

export default async function CampaignDraftReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ draftId: string }>;
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const { draftId } = await params;
  const resolvedSearchParams = await searchParams;
  const { reviewState, draftRecord, source, error } = await getCampaignReviewForRouteState(draftId, resolvedSearchParams?.segmentKey);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Campaign Asset Review</h1>
        <p style={{ margin: 0 }}>Generated assets grouped by channel before launch approval.</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign review" error={error} />

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Review Summary</h2>
        <p style={{ margin: '8px 0' }}>Segment: {reviewState.linkedSegment.label}</p>
        <p style={{ margin: '8px 0' }}>{reviewState.reviewSummary}</p>
        <p style={{ margin: '8px 0' }}>Draft status: <strong>{draftRecord.status}</strong></p>
        <p style={{ margin: '8px 0' }}>Draft key: {draftRecord.draftKey}</p>
        <p style={{ margin: '8px 0' }}>Last updated: {draftRecord.updatedAt ?? 'Not persisted yet'}</p>
        <p style={{ margin: '8px 0 0' }}>Pending channels: {reviewState.pendingChannels.join(', ')}</p>
      </section>

      <CampaignReviewSummaryEditor draftKey={draftRecord.draftKey} initialSummary={reviewState.reviewSummary} />

      <CampaignDraftPersistencePanel
        mode="update"
        draftKey={reviewState.draftId}
        campaignKey={`${reviewState.linkedSegment.segmentKey}-campaign`}
        segmentKey={reviewState.linkedSegment.segmentKey}
        title={`${reviewState.linkedSegment.label} Campaign Draft`}
        objective={reviewState.linkedSegment.recommendedObjective}
        status="ready_for_review"
        selectedChannels={reviewState.assets.map((asset) => ({ channel: asset.channel, enabled: true }))}
        assets={reviewState.assets}
        details={{
          reviewSummary: reviewState.reviewSummary,
          pendingChannels: reviewState.pendingChannels,
          approvedChannels: reviewState.approvedChannels,
          rejectedChannels: reviewState.rejectedChannels,
          nextApprovalRoute: reviewState.nextApprovalRoute,
        }}
      />

      <section style={{ display: 'grid', gap: 16 }}>
        {reviewState.assets.map((asset) => (
          <article key={asset.assetId} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{asset.title}</h2>
            <p style={{ margin: '8px 0' }}>Channel: {asset.channel}</p>
            <p style={{ margin: '8px 0' }}>Status: {asset.status}</p>
            <p style={{ margin: '8px 0' }}>{asset.bodyPreview}</p>
            {asset.changeRequestNote ? <p style={{ margin: '8px 0 0' }}>Requested changes: {asset.changeRequestNote}</p> : null}
          </article>
        ))}
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {reviewState.nextApprovalRoute ? <Link href={reviewState.nextApprovalRoute}>Open launch approval shell</Link> : null}
        <Link href={`/campaigns/new/from-segment?segmentKey=${reviewState.linkedSegment.segmentKey}`}>Back to builder</Link>
      </section>
    </main>
  );
}
