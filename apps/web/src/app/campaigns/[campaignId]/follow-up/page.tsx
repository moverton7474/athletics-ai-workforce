import Link from 'next/link';
import { CampaignNextActionCard } from '../../../../components/campaigns/CampaignNextActionCard';
import { CampaignWorkflowStatusCard } from '../../../../components/campaigns/CampaignWorkflowStatusCard';
import { CampaignWorkflowTimeline } from '../../../../components/campaigns/CampaignWorkflowTimeline';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { buildCampaignWorkflowEvents } from '../../../../lib/campaign-workflow-events';
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
        <p style={{ margin: 0 }}>Manual and voice parity shell for the next recommended campaign action.</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign follow-up" error={error} />

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
