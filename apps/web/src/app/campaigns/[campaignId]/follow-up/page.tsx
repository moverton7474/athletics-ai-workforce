import Link from 'next/link';
import { CampaignNextActionCard } from '../../../../components/campaigns/CampaignNextActionCard';
import { CampaignWorkflowStatusCard } from '../../../../components/campaigns/CampaignWorkflowStatusCard';
import { CampaignWorkflowTimeline } from '../../../../components/campaigns/CampaignWorkflowTimeline';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { buildCampaignWorkflowEvents } from '../../../../lib/campaign-workflow-events';
import { getCampaignFollowUpForRouteState } from '../../../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

export default async function CampaignFollowUpPage({
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
  const workflowEvents = buildCampaignWorkflowEvents({
    draftStatus: draftRecord.status,
    draftUpdatedAt: draftRecord.updatedAt,
    reviewSummary: typeof draftDetails.reviewSummary === 'string' ? draftDetails.reviewSummary : undefined,
    reviewSummaryUpdatedAt: typeof draftDetails.reviewSummaryUpdatedAt === 'string' ? draftDetails.reviewSummaryUpdatedAt : undefined,
    approvalSubmittedAt: typeof draftDetails.approvalSubmittedAt === 'string' ? draftDetails.approvalSubmittedAt : undefined,
    approvalStatus: typeof draftDetails.approvalStatus === 'string' ? draftDetails.approvalStatus : undefined,
    approvalDecisionNote: typeof draftDetails.approvalDecisionNote === 'string' ? draftDetails.approvalDecisionNote : undefined,
    approvalDecidedAt: typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined,
    outcomeTaskId: typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined,
    outcomeTaskCreatedAt: typeof draftDetails.outcomeTaskCreatedAt === 'string' ? draftDetails.outcomeTaskCreatedAt : undefined,
  });

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Campaign Follow-Up</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>
          This route keeps the operator focused on what should happen after results are reviewed: what to relaunch, what to suppress, and what next campaign should be opened from the same context.
        </p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign follow-up" error={error} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <p style={mutedLabelStyle}>Follow-up orchestration</p>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>Follow-Up Recommendation</h2>
          <p style={{ margin: 0 }}>{followUpState.recommendedNextCampaign?.reason ?? 'No recommendation available yet.'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Suggested segment</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.recommendedNextCampaign?.suggestedSegmentKey ?? 'Unknown'}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Suggested objective</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.recommendedNextCampaign?.suggestedObjective ?? 'Not provided'}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Current result status</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.resultStatus.replaceAll('_', ' ')}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Scheduled notifications</p>
            <p style={{ margin: '8px 0 0' }}>{followUpState.scheduledNotifications.length}</p>
          </article>
        </div>
      </section>

      <CampaignWorkflowStatusCard
        draftStatus={draftRecord.status}
        approvalStatus={typeof draftDetails.approvalStatus === 'string' ? draftDetails.approvalStatus : undefined}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        latestApprovalNote={typeof draftDetails.approvalDecisionNote === 'string' ? draftDetails.approvalDecisionNote : undefined}
        approvalDecidedAt={typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined}
        outcomeTaskId={typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={typeof draftDetails.nextApprovalRoute === 'string' ? draftDetails.nextApprovalRoute : undefined}
        resultsRoute={`/campaigns/${campaignId}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${campaignId}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <CampaignNextActionCard
        currentSurface="follow_up"
        draftStatus={draftRecord.status}
        approvalStatus={typeof draftDetails.approvalStatus === 'string' ? draftDetails.approvalStatus : undefined}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={typeof draftDetails.nextApprovalRoute === 'string' ? draftDetails.nextApprovalRoute : undefined}
        resultsRoute={`/campaigns/${campaignId}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${campaignId}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <CampaignWorkflowTimeline events={workflowEvents} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Follow-Up Queue</h2>
          <p style={{ margin: 0 }}>These notifications and queued checks are the operator-visible bridge from campaign performance into the next governed action.</p>
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

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Relaunch Decision Frame</h2>
          <p style={{ margin: 0 }}>Use this frame to decide whether the next move is a refined relaunch, a more personalized outreach pass, or a deliberate pause.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Relaunch when</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>the segment is still valid</li>
              <li>response signals are promising but incomplete</li>
              <li>the next touch should stay in the same workflow</li>
            </ul>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Personalize when</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>high-value non-responders need tighter handling</li>
              <li>channel performance is uneven</li>
              <li>operator judgment suggests a narrower follow-up segment</li>
            </ul>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Pause when</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>the campaign objective needs to change</li>
              <li>the audience no longer fits the outreach</li>
              <li>the next action is unclear enough that relaunch would be noisy</li>
            </ul>
          </article>
        </div>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/campaigns/new/from-segment?segmentKey=${followUpState.recommendedNextCampaign?.suggestedSegmentKey ?? 'ksu-football-2026-non-renewals'}`}>Open next campaign builder</Link>
        <Link href={`/campaigns/${campaignId}/results?segmentKey=${draftRecord.segmentKey}`}>Back to results</Link>
      </section>
    </main>
  );
}
