import Link from 'next/link';
import { getGeneratedAssetReviewState } from '../../../../../lib/voice-route-state';

export default async function CampaignDraftReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ draftId: string }>;
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const { draftId } = await params;
  const resolvedSearchParams = await searchParams;
  const reviewState = getGeneratedAssetReviewState(draftId, resolvedSearchParams?.segmentKey);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Campaign Asset Review</h1>
        <p style={{ margin: 0 }}>Generated assets grouped by channel before launch approval.</p>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Review Summary</h2>
        <p style={{ margin: '8px 0' }}>Segment: {reviewState.linkedSegment.label}</p>
        <p style={{ margin: '8px 0' }}>{reviewState.reviewSummary}</p>
        <p style={{ margin: '8px 0 0' }}>Pending channels: {reviewState.pendingChannels.join(', ')}</p>
      </section>

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
