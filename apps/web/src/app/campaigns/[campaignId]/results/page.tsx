import Link from 'next/link';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { getCampaignFollowUpForRouteState } from '../../../../lib/services/route-state';

export default async function CampaignResultsPage({
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
        <h1 style={{ marginBottom: 8 }}>{followUpState.campaignName}</h1>
        <p style={{ margin: 0 }}>Results and follow-up shell for governed campaign lifecycle review.</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign results" error={error} />

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Performance Summary</h2>
        <p style={{ margin: '8px 0' }}>Status: {followUpState.resultStatus}</p>
        <p style={{ margin: '8px 0 0' }}>{followUpState.performanceSummary}</p>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Channel Results</h2>
        <ul style={{ marginBottom: 0 }}>
          {followUpState.channelResults.map((result) => (
            <li key={result.channel}>
              {result.channel} — {result.status} — {result.summary}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Scheduled Follow-Up</h2>
        <ul style={{ marginBottom: 0 }}>
          {followUpState.scheduledNotifications.map((notification) => (
            <li key={notification.notificationId}>
              {notification.label} — {notification.scheduledForIso} — {notification.status}
            </li>
          ))}
        </ul>
      </section>

      {followUpState.recommendedNextCampaign ? (
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Recommended Next Campaign</h2>
          <p style={{ margin: '8px 0' }}>{followUpState.recommendedNextCampaign.reason}</p>
          <p style={{ margin: '8px 0' }}>Suggested objective: {followUpState.recommendedNextCampaign.suggestedObjective}</p>
          {followUpState.recommendedNextCampaign.launchRoute ? (
            <Link href={followUpState.recommendedNextCampaign.launchRoute}>Open follow-up route</Link>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
