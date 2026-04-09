import Link from 'next/link';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { getCampaignFollowUpForRouteState } from '../../../../lib/services/route-state';

export default async function CampaignFollowUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const { campaignId } = await params;
  const resolvedSearchParams = await searchParams;
  const { followUpState, source, error } = await getCampaignFollowUpForRouteState(campaignId, resolvedSearchParams?.segmentKey);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Campaign Follow-Up</h1>
        <p style={{ margin: 0 }}>Manual and voice parity shell for the next recommended campaign action.</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign follow-up" error={error} />

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Follow-Up Recommendation</h2>
        <p style={{ margin: '8px 0' }}>{followUpState.recommendedNextCampaign?.reason ?? 'No recommendation available yet.'}</p>
        <p style={{ margin: '8px 0' }}>
          Suggested segment: {followUpState.recommendedNextCampaign?.suggestedSegmentKey ?? 'Unknown'}
        </p>
        <p style={{ margin: '8px 0 0' }}>
          Suggested objective: {followUpState.recommendedNextCampaign?.suggestedObjective ?? 'Not provided'}
        </p>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/campaigns/new/from-segment?segmentKey=${followUpState.recommendedNextCampaign?.suggestedSegmentKey ?? 'ksu-football-2026-non-renewals'}`}>Open next campaign builder</Link>
        <Link href={`/campaigns/${campaignId}/results`}>Back to results</Link>
      </section>
    </main>
  );
}
