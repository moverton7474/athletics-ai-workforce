import Link from 'next/link';
import { CampaignNextActionCard } from '../../../../components/campaigns/CampaignNextActionCard';
import { CampaignWorkflowStatusCard } from '../../../../components/campaigns/CampaignWorkflowStatusCard';
import { CampaignWorkflowTimeline } from '../../../../components/campaigns/CampaignWorkflowTimeline';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { buildCampaignWorkflowEvents } from '../../../../lib/campaign-workflow-events';
import { getCampaignFollowUpForRouteState } from '../../../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

export default async function CampaignResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const { campaignId } = await params;
  const resolvedSearchParams = await searchParams;
  const { followUpState, draftRecord, source, error } = await getCampaignFollowUpForRouteState(campaignId, resolvedSearchParams?.segmentKey);
  const draftDetails: Record<string, unknown> =
    draftRecord.details && typeof draftRecord.details === 'object'
      ? (draftRecord.details as Record<string, unknown>)
      : {};
  const approvalStatus = typeof draftDetails.approvalStatus === 'string' ? draftDetails.approvalStatus : undefined;
  const approvalDecisionNote = typeof draftDetails.approvalDecisionNote === 'string' ? draftDetails.approvalDecisionNote : undefined;
  const approvalRoute = typeof draftDetails.nextApprovalRoute === 'string' ? draftDetails.nextApprovalRoute : undefined;
  const workflowEvents = buildCampaignWorkflowEvents({
    draftStatus: draftRecord.status,
    draftUpdatedAt: draftRecord.updatedAt,
    reviewSummary: typeof draftDetails.reviewSummary === 'string' ? draftDetails.reviewSummary : undefined,
    reviewSummaryUpdatedAt: typeof draftDetails.reviewSummaryUpdatedAt === 'string' ? draftDetails.reviewSummaryUpdatedAt : undefined,
    approvalSubmittedAt: typeof draftDetails.approvalSubmittedAt === 'string' ? draftDetails.approvalSubmittedAt : undefined,
    approvalStatus,
    approvalDecisionNote,
    approvalDecidedAt: typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined,
    outcomeTaskId: typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined,
    outcomeTaskCreatedAt: typeof draftDetails.outcomeTaskCreatedAt === 'string' ? draftDetails.outcomeTaskCreatedAt : undefined,
  });

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>{followUpState.campaignName}</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>
          Review campaign performance, keep the workflow state visible, and decide whether the next action should be optimization, follow-up, or a new launch.
        </p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign results" error={error} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <p style={mutedLabelStyle}>Campaign results</p>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>Performance Summary</h2>
          <p style={{ margin: 0 }}>{followUpState.performanceSummary}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Result status</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.resultStatus.replaceAll('_', ' ')}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Approval posture</p>
            <p style={{ margin: '8px 0 0' }}>{(approvalStatus ?? 'not_submitted').replaceAll('_', ' ')}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Active channels</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.channelResults.length}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Scheduled follow-ups</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.scheduledNotifications.length}</p>
          </article>
        </div>
      </section>

      <CampaignWorkflowStatusCard
        draftStatus={draftRecord.status}
        approvalStatus={approvalStatus}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        latestApprovalNote={approvalDecisionNote}
        approvalDecidedAt={typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined}
        outcomeTaskId={typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={approvalRoute}
        resultsRoute={`/campaigns/${campaignId}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${campaignId}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <CampaignNextActionCard
        currentSurface="results"
        draftStatus={draftRecord.status}
        approvalStatus={approvalStatus}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={approvalRoute}
        resultsRoute={`/campaigns/${campaignId}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${campaignId}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <CampaignWorkflowTimeline events={workflowEvents} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Channel Results</h2>
          <p style={{ margin: 0 }}>Results stay broken out by channel so the operator can see which touchpoints are working and which ones need intervention.</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {followUpState.channelResults.map((result) => (
            <article key={result.channel} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={mutedLabelStyle}>{result.channel}</p>
                  <h3 style={{ marginTop: 8, marginBottom: 8 }}>{result.status.replaceAll('_', ' ')}</h3>
                </div>
              </div>
              <p style={{ margin: 0 }}>{result.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Scheduled Follow-Up</h2>
          <p style={{ margin: 0 }}>The next actions should remain visible as scheduled work, not disappear after the first campaign run completes.</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {followUpState.scheduledNotifications.map((notification) => (
            <article key={notification.notificationId} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>{notification.status}</p>
              <h3 style={{ marginTop: 8, marginBottom: 8 }}>{notification.label}</h3>
              <p style={{ margin: 0 }}>Scheduled for: {notification.scheduledForIso}</p>
            </article>
          ))}
        </div>
      </section>

      {followUpState.recommendedNextCampaign ? (
        <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recommended Next Campaign</h2>
            <p style={{ margin: 0 }}>{followUpState.recommendedNextCampaign.reason}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Suggested segment</p>
              <p style={{ margin: '8px 0 0' }}>{followUpState.recommendedNextCampaign.suggestedSegmentKey ?? 'Unknown'}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Suggested objective</p>
              <p style={{ margin: '8px 0 0' }}>{followUpState.recommendedNextCampaign.suggestedObjective ?? 'Not provided'}</p>
            </article>
          </div>
          {followUpState.recommendedNextCampaign.launchRoute ? <Link href={followUpState.recommendedNextCampaign.launchRoute}>Open follow-up route</Link> : null}
        </section>
      ) : null}
    </main>
  );
}
