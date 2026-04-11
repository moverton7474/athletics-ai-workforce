import Link from 'next/link';
import { CampaignDraftPersistencePanel } from '../../../../../components/campaigns/CampaignDraftPersistencePanel';
import { CampaignNextActionCard } from '../../../../../components/campaigns/CampaignNextActionCard';
import { CampaignReviewSummaryEditor } from '../../../../../components/campaigns/CampaignReviewSummaryEditor';
import { WorkflowEntryContextCard } from '../../../../../components/campaigns/WorkflowEntryContextCard';
import { CampaignWorkflowStatusCard } from '../../../../../components/campaigns/CampaignWorkflowStatusCard';
import { CampaignWorkflowTimeline } from '../../../../../components/campaigns/CampaignWorkflowTimeline';
import { SubmitCampaignForApprovalButton } from '../../../../../components/campaigns/SubmitCampaignForApprovalButton';
import { DataSourceNotice } from '../../../../../components/system/DataSourceNotice';
import { buildCampaignWorkflowEvents } from '../../../../../lib/campaign-workflow-events';
import { getCampaignReviewForRouteState } from '../../../../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

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
  const draftDetails: Record<string, unknown> =
    draftRecord.details && typeof draftRecord.details === 'object'
      ? (draftRecord.details as Record<string, unknown>)
      : {};
  const approvalRoute = typeof draftDetails.nextApprovalRoute === 'string' ? draftDetails.nextApprovalRoute : undefined;
  const approvalStatus = typeof draftDetails.approvalStatus === 'string' ? draftDetails.approvalStatus : undefined;
  const approvalDecisionNote = typeof draftDetails.approvalDecisionNote === 'string' ? draftDetails.approvalDecisionNote : undefined;
  const approvalDecidedAt = typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined;
  const workflowEvents = buildCampaignWorkflowEvents({
    draftStatus: draftRecord.status,
    draftUpdatedAt: draftRecord.updatedAt,
    reviewSummary: reviewState.reviewSummary,
    reviewSummaryUpdatedAt: typeof draftDetails.reviewSummaryUpdatedAt === 'string' ? draftDetails.reviewSummaryUpdatedAt : undefined,
    approvalSubmittedAt: typeof draftDetails.approvalSubmittedAt === 'string' ? draftDetails.approvalSubmittedAt : undefined,
    approvalStatus,
    approvalDecisionNote,
    approvalDecidedAt,
    outcomeTaskId: typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined,
    outcomeTaskCreatedAt: typeof draftDetails.outcomeTaskCreatedAt === 'string' ? draftDetails.outcomeTaskCreatedAt : undefined,
  });

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Campaign Asset Review</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>
          Review generated campaign assets by channel, capture operator judgment, and route only governed work into the approval layer.
        </p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign review" error={error} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <p style={mutedLabelStyle}>Review shell</p>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>Review Summary</h2>
          <p style={{ margin: 0, maxWidth: 860 }}>{reviewState.reviewSummary}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Segment</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.linkedSegment.label}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Draft status</p>
            <p style={{ margin: '8px 0 0' }}>
              <strong>{draftRecord.status}</strong>
            </p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Approval status</p>
            <p style={{ margin: '8px 0 0' }}>
              <strong>{approvalStatus ?? 'not submitted'}</strong>
            </p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Pending channels</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.pendingChannels.join(', ') || 'None'}</p>
          </article>
        </div>

        <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Decision context</h3>
          <p style={{ margin: 0 }}>Draft key: {draftRecord.draftKey}</p>
          <p style={{ margin: '8px 0 0' }}>Last updated: {draftRecord.updatedAt ?? 'Not persisted yet'}</p>
          {approvalDecisionNote ? <p style={{ margin: '8px 0 0' }}>Latest approval note: {approvalDecisionNote}</p> : null}
          {approvalDecidedAt ? <p style={{ margin: '8px 0 0' }}>Approval decided at: {approvalDecidedAt}</p> : null}
        </article>
      </section>

      <CampaignWorkflowStatusCard
        draftStatus={draftRecord.status}
        approvalStatus={approvalStatus}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        latestApprovalNote={approvalDecisionNote}
        approvalDecidedAt={approvalDecidedAt}
        outcomeTaskId={typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={approvalRoute}
        resultsRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <WorkflowEntryContextCard
        entryMode={typeof draftDetails.entryMode === 'string' ? draftDetails.entryMode : reviewState.prefillMeta.entryMode}
        voiceActionMode={typeof draftDetails.voiceActionMode === 'string' ? draftDetails.voiceActionMode : reviewState.prefillMeta.voiceActionMode}
        sourceCommand={typeof draftDetails.sourceCommand === 'string' ? draftDetails.sourceCommand : reviewState.prefillMeta.sourceCommand}
        sourceWorker={typeof draftDetails.sourceWorker === 'string' ? draftDetails.sourceWorker : reviewState.prefillMeta.sourceWorker}
        confidence={typeof draftDetails.confidence === 'string' ? draftDetails.confidence : reviewState.prefillMeta.confidence}
      />

      <CampaignNextActionCard
        currentSurface="review"
        draftStatus={draftRecord.status}
        approvalStatus={approvalStatus}
        workflowState={typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState : undefined}
        reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
        approvalRoute={approvalRoute}
        resultsRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/results?segmentKey=${draftRecord.segmentKey}`}
        followUpRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/follow-up?segmentKey=${draftRecord.segmentKey}`}
      />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Channel Review Board</h2>
          <p style={{ margin: 0 }}>Each asset stays visible by channel so the operator can assess readiness before launch approval is requested.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Ready for review</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.pendingChannels.length}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Approved channels</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.approvedChannels.length}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Rejected channels</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.rejectedChannels.length}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Change requests allowed</p>
            <p style={{ margin: '8px 0 0' }}>{reviewState.requestChangesAllowed ? 'Yes' : 'No'}</p>
          </article>
        </div>

        <section style={{ display: 'grid', gap: 16 }}>
          {reviewState.assets.map((asset) => (
            <article key={asset.assetId} style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={mutedLabelStyle}>{asset.channel}</p>
                  <h3 style={{ marginTop: 8, marginBottom: 8 }}>{asset.title}</h3>
                </div>
                <strong>{asset.status.replaceAll('_', ' ')}</strong>
              </div>
              <p style={{ margin: 0 }}>{asset.bodyPreview}</p>
              {asset.changeRequestNote ? <p style={{ margin: '8px 0 0' }}>Requested changes: {asset.changeRequestNote}</p> : null}
            </article>
          ))}
        </section>
      </section>

      <CampaignWorkflowTimeline events={workflowEvents} />

      <CampaignReviewSummaryEditor draftKey={draftRecord.draftKey} initialSummary={reviewState.reviewSummary} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Approval Readiness</h2>
          <p style={{ margin: 0 }}>
            Use this step to capture the operator's review judgment, persist the updated draft state, and only then route the campaign into launch approval.
          </p>
        </div>

        <SubmitCampaignForApprovalButton
          draftKey={draftRecord.draftKey}
          existingApprovalRoute={approvalRoute}
          existingApprovalStatus={approvalStatus}
        />

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
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {reviewState.nextApprovalRoute ? <Link href={reviewState.nextApprovalRoute}>Open launch approval shell</Link> : null}
        <Link href={`/campaigns/new/from-segment?segmentKey=${reviewState.linkedSegment.segmentKey}`}>Back to builder</Link>
      </section>
    </main>
  );
}
