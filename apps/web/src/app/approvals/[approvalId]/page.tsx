export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ApprovalActions } from '../../../components/approvals/ApprovalActions';
import { CampaignNextActionCard } from '../../../components/campaigns/CampaignNextActionCard';
import { CampaignWorkflowStatusCard } from '../../../components/campaigns/CampaignWorkflowStatusCard';
import { CampaignWorkflowTimeline } from '../../../components/campaigns/CampaignWorkflowTimeline';
import { MemoryEntryList } from '../../../components/memory/MemoryEntryList';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { buildCampaignWorkflowEvents } from '../../../lib/campaign-workflow-events';
import { getCurrentUserContext } from '../../../lib/server/membership';
import { getApprovalDecisionState } from '../../../lib/voice-route-state';
import { getApprovalById } from '../../../lib/services/approvals';
import { listMemoryEntriesForApproval } from '../../../lib/services/memory';
import { getCampaignDraftRecordByKey } from '../../../lib/services/route-state';
import { listTasks } from '../../../lib/services/tasks';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

export default async function ApprovalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ approvalId: string }>;
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const { approvalId } = await params;
  const resolvedSearchParams = await searchParams;
  const [{ approval, source, error }, { memberships }, { tasks }, { entries: memoryEntries }] = await Promise.all([
    getApprovalById(approvalId),
    getCurrentUserContext(),
    listTasks(),
    listMemoryEntriesForApproval(approvalId),
  ]);
  const linkedDraftKey = typeof approval?.details?.draft_key === 'string' ? approval.details.draft_key : null;
  const { draftRecord } = linkedDraftKey ? await getCampaignDraftRecordByKey(linkedDraftKey) : { draftRecord: null };

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));
  const fallbackState = !approval ? getApprovalDecisionState(approvalId, resolvedSearchParams?.segmentKey) : null;
  const originTask = approval?.taskId ? tasks.find((task) => task.id === approval.taskId) ?? null : null;
  const outcomeTask = approval?.outcomeTaskId ? tasks.find((task) => task.id === approval.outcomeTaskId) ?? null : null;
  const decisionHistory = Array.isArray(approval?.details?.decision_history)
    ? approval?.details?.decision_history.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
    : [];
  const draftDetails: Record<string, unknown> =
    draftRecord?.details && typeof draftRecord.details === 'object'
      ? (draftRecord.details as Record<string, unknown>)
      : {};
  const workflowEvents = draftRecord
    ? buildCampaignWorkflowEvents({
        draftStatus: draftRecord.status,
        draftUpdatedAt: draftRecord.updatedAt,
        reviewSummary: typeof draftDetails.reviewSummary === 'string' ? draftDetails.reviewSummary : undefined,
        reviewSummaryUpdatedAt: typeof draftDetails.reviewSummaryUpdatedAt === 'string' ? draftDetails.reviewSummaryUpdatedAt : undefined,
        approvalSubmittedAt: typeof draftDetails.approvalSubmittedAt === 'string' ? draftDetails.approvalSubmittedAt : approval?.createdAt,
        approvalStatus: approval?.status,
        approvalDecisionNote: approval?.decisionNote ?? (typeof draftDetails.approvalDecisionNote === 'string' ? draftDetails.approvalDecisionNote : undefined),
        approvalDecidedAt: approval?.decidedAt ?? (typeof draftDetails.approvalDecidedAt === 'string' ? draftDetails.approvalDecidedAt : undefined),
        outcomeTaskId: approval?.outcomeTaskId ?? (typeof draftDetails.outcomeTaskId === 'string' ? draftDetails.outcomeTaskId : undefined),
        outcomeTaskCreatedAt: typeof draftDetails.outcomeTaskCreatedAt === 'string' ? draftDetails.outcomeTaskCreatedAt : undefined,
      })
    : [];
  const recommendedApprovalAction = !approval
    ? null
    : approval.status === 'pending'
      ? 'Decide this approval or request changes before the workflow stalls.'
      : approval.status === 'approved'
        ? 'Open the linked outcome task and make sure the approved work is moving.'
        : approval.status === 'rejected'
          ? 'Review the origin task, capture rationale, and repackage the next attempt.'
          : 'Review the latest decision note and confirm the next operator handoff is clear.';
  const escalationLevel = !approval
    ? null
    : approval.status === 'pending'
      ? 'high'
      : approval.status === 'rejected'
        ? 'medium'
        : 'low';
  const escalationSummary = !approval
    ? null
    : approval.status === 'pending'
      ? 'A pending approval means connector or workflow output is waiting on a human decision to move forward.'
      : approval.status === 'rejected'
        ? 'The workflow has been stopped and should be repackaged with clearer rationale before retrying.'
        : approval.status === 'approved'
          ? 'The main risk is no longer decision delay but making sure the approved downstream work actually executes.'
          : 'Review the latest decision state and make sure the next handoff is still obvious to the operator.';
  const escalationStyles =
    escalationLevel === 'high'
      ? { border: '#fca5a5', background: '#fef2f2' }
      : escalationLevel === 'medium'
        ? { border: '#fdba74', background: '#fff7ed' }
        : { border: '#86efac', background: '#ecfdf3' };
  const approvalDetails = approval?.details && typeof approval.details === 'object' ? approval.details : {};
  const riskLevel = !approval
    ? 'unknown'
    : typeof approvalDetails.riskLevel === 'string'
      ? approvalDetails.riskLevel
      : approval.requestedAction === 'proposal_submit'
        ? 'high'
        : approval.approvalType.includes('launch') || approval.approvalType.includes('outreach')
          ? 'medium'
          : 'medium';
  const confidenceLabel = !approval
    ? 'unknown'
    : typeof approvalDetails.confidence === 'string'
      ? approvalDetails.confidence
      : approval.connectorRunId
        ? 'connector-backed recommendation'
        : 'operator review required';
  const expiresAt = !approval
    ? null
    : typeof approvalDetails.expiresAt === 'string'
      ? approvalDetails.expiresAt
      : null;
  const reviewPosture = !approval
    ? null
    : approval.status === 'pending'
      ? 'A human decision is still required before the governed workflow can move forward.'
      : approval.status === 'approved'
        ? 'The approval gate is cleared; the remaining risk is execution follow-through and handoff quality.'
        : approval.status === 'changes_requested'
          ? 'The workflow remains live, but work must be revised before another approval attempt.'
          : 'The workflow was intentionally stopped and should only restart with clearer rationale.';

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24, background: 'linear-gradient(180deg, #fafafc 0%, #ffffff 260px)' }}>
      <section
        style={{
          borderRadius: 24,
          padding: 24,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #312e81 100%)',
          color: '#fff',
          display: 'grid',
          gap: 18,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 760, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '6px 12px', background: 'rgba(255,255,255,0.08)' }}>Approval review</span>
              <span style={{ border: '1px solid rgba(197,165,114,0.35)', borderRadius: 999, padding: '6px 12px', background: 'rgba(197,165,114,0.14)', color: '#f5deb3' }}>Human-in-the-loop gate</span>
            </div>
            <div>
              <h1 style={{ margin: 0, marginBottom: 8 }}>Approval Review</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
                Review workflow context, evaluate execution risk, capture rationale, and decide whether this work should move forward.
              </p>
            </div>
          </div>
          <Link href="/approvals" style={{ color: '#fff' }}>Back to approvals</Link>
        </div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {[
            { label: 'Status', value: approval ? approval.status.replaceAll('_', ' ') : 'unavailable', tone: '#fbbf24' },
            { label: 'Risk level', value: riskLevel, tone: riskLevel === 'high' ? '#fca5a5' : riskLevel === 'medium' ? '#fcd34d' : '#86efac' },
            { label: 'Confidence', value: confidenceLabel, tone: '#c4b5fd' },
            { label: 'Expires', value: expiresAt ?? 'No expiry recorded', tone: '#93c5fd' },
          ].map((item) => (
            <article key={item.label} style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 16, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ color: item.tone, fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.88)' }}>{item.value}</div>
            </article>
          ))}
        </div>

        {reviewPosture ? (
          <section style={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, padding: 16, background: 'rgba(255,255,255,0.06)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 18 }}>Decision posture</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)' }}>{reviewPosture}</p>
          </section>
        ) : null}
      </section>

      <DataSourceNotice source={source} entityLabel="Approval detail" error={error} />

      {!approval && fallbackState ? (
        <>
          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>{fallbackState.title}</h2>
              <p style={{ margin: 0 }}>{fallbackState.summary}</p>
            </div>
            <p style={{ margin: 0 }}>
              This approval shell is rendering from the shared route/state contract layer because no persisted approval record was found yet.
            </p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Approval type: {fallbackState.approvalType}</li>
              <li>Decision note required: {fallbackState.decisionNoteRequired ? 'Yes' : 'No'}</li>
              <li>Blocked actions: {fallbackState.blockedActions.join(', ')}</li>
              <li>Available decisions: {fallbackState.availableDecisions.join(', ')}</li>
            </ul>
          </section>

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Dependencies</h2>
            <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
              {fallbackState.dependencies.map((dependency) => (
                <li key={`${dependency.dependencyType}-${dependency.label}`}>
                  {dependency.label} — {dependency.status}
                </li>
              ))}
            </ul>
          </section>

          {fallbackState.linkedSegment ? (
            <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/campaigns/drafts/${fallbackState.draftId}/review?segmentKey=${fallbackState.linkedSegment.segmentKey}`}>
                Open asset review shell
              </Link>
              {fallbackState.postDecisionRoute ? (
                <Link href={`${fallbackState.postDecisionRoute}?segmentKey=${fallbackState.linkedSegment.segmentKey}`}>
                  Open post-decision results shell
                </Link>
              ) : null}
            </section>
          ) : null}
        </>
      ) : !approval ? (
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0 }}>Approval not found.</p>
        </section>
      ) : (
        <>
          <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>{approval.title}</h2>
              <p style={{ margin: 0 }}>
                Status: {approval.status.replaceAll('_', ' ')} · Type: {approval.approvalType.replaceAll('_', ' ')}
              </p>
            </div>

            {approval.summary ? <p style={{ margin: 0 }}>{approval.summary}</p> : null}

            <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Decision guardrail</h3>
                <p style={{ margin: 0, color: '#555' }}>
                  {approval.status === 'pending'
                    ? 'Do not let this approval sit without rationale. Approve, reject, or request changes with an explicit note for the next operator.'
                    : 'This decision already has a recorded state. The operator job now is making sure downstream work and rationale remain visible.'}
                </p>
              </article>
              <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Autonomy posture</h3>
                <p style={{ margin: 0, color: '#555' }}>
                  This workflow is intentionally human-gated. Risk, context, and downstream action ownership should all be visible before execution moves forward.
                </p>
              </article>
            </section>

            <div style={{ display: 'grid', gap: 8 }}>
              <h3 style={{ margin: 0 }}>Workflow Context</h3>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {approval.entityName ? <li>Entity: {approval.entityName}</li> : null}
                {approval.entityType ? <li>Entity type: {approval.entityType.replaceAll('_', ' ')}</li> : null}
                {approval.stage ? <li>Stage: {approval.stage.replaceAll('_', ' ')}</li> : null}
                {approval.requestedAction ? <li>Requested action: {approval.requestedAction.replaceAll('_', ' ')}</li> : null}
                {approval.targetSystem ? <li>Target system: {approval.targetSystem.replaceAll('_', ' ')}</li> : null}
                {approval.nextActionLabel ? <li>Recommended next action: {approval.nextActionLabel}</li> : null}
                {approval.connectorRunId ? <li>Connector run id: {approval.connectorRunId}</li> : null}
                {approval.createdAt ? <li>Created: {approval.createdAt}</li> : null}
                {approval.decidedAt ? <li>Decided: {approval.decidedAt}</li> : null}
              </ul>
            </div>

            {approval.decisionNote ? (
              <div>
                <h3 style={{ marginBottom: 8 }}>Decision Note</h3>
                <p style={{ margin: 0 }}>{approval.decisionNote}</p>
              </div>
            ) : null}

            <ApprovalActions approvalId={approval.id} approvalStatus={approval.status} canDecide={canDecide} />
          </section>

          {draftRecord ? (
            <>
              <CampaignWorkflowStatusCard
                draftStatus={draftRecord.status}
                approvalStatus={approval.status}
                workflowState={typeof draftRecord.details?.workflowState === 'string' ? draftRecord.details.workflowState : undefined}
                latestApprovalNote={approval.decisionNote ?? (typeof draftRecord.details?.approvalDecisionNote === 'string' ? draftRecord.details.approvalDecisionNote : undefined)}
                approvalDecidedAt={approval.decidedAt ?? (typeof draftRecord.details?.approvalDecidedAt === 'string' ? draftRecord.details.approvalDecidedAt : undefined)}
                outcomeTaskId={approval.outcomeTaskId ?? (typeof draftRecord.details?.outcomeTaskId === 'string' ? draftRecord.details.outcomeTaskId : undefined)}
                reviewRoute={`/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}`}
                approvalRoute={`/approvals/${approval.id}`}
                resultsRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/results?segmentKey=${draftRecord.segmentKey}`}
                followUpRoute={`/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/follow-up?segmentKey=${draftRecord.segmentKey}`}
              />
              <CampaignWorkflowTimeline events={workflowEvents} />
            </>
          ) : null}

          <CampaignNextActionCard
            currentSurface="approval"
            draftStatus={draftRecord?.status ?? 'awaiting_approval'}
            approvalStatus={approval.status}
            workflowState={typeof draftRecord?.details?.workflowState === 'string' ? draftRecord.details.workflowState : undefined}
            reviewRoute={draftRecord ? `/campaigns/drafts/${draftRecord.draftKey}/review?segmentKey=${draftRecord.segmentKey}` : undefined}
            approvalRoute={`/approvals/${approval.id}`}
            resultsRoute={draftRecord ? `/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/results?segmentKey=${draftRecord.segmentKey}` : undefined}
            followUpRoute={draftRecord ? `/campaigns/${draftRecord.campaignKey ?? `${draftRecord.segmentKey}-campaign`}/follow-up?segmentKey=${draftRecord.segmentKey}` : undefined}
          />

          {draftRecord ? (
            <section style={sectionStyle}>
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Campaign Approval Frame</h2>
                <p style={{ margin: 0 }}>
                  This approval should be read as a governed launch decision for the campaign workflow, not as an isolated record. The operator should confirm
                  asset readiness, rationale quality, and downstream ownership before clearing execution.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <p style={mutedLabelStyle}>Linked draft</p>
                  <p style={{ margin: '8px 0 0' }}>{draftRecord.title}</p>
                </article>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <p style={mutedLabelStyle}>Review summary</p>
                  <p style={{ margin: '8px 0 0' }}>{typeof draftDetails.reviewSummary === 'string' ? draftDetails.reviewSummary : 'No review summary captured yet.'}</p>
                </article>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <p style={mutedLabelStyle}>Workflow state</p>
                  <p style={{ margin: '8px 0 0' }}>{typeof draftDetails.workflowState === 'string' ? draftDetails.workflowState.replaceAll('_', ' ') : 'approval review'}</p>
                </article>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <p style={mutedLabelStyle}>Approval dependency</p>
                  <p style={{ margin: '8px 0 0' }}>{approval.requestedAction ? approval.requestedAction.replaceAll('_', ' ') : 'campaign launch'}</p>
                </article>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 8 }}>Approve when</h3>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>the review summary is decision-ready</li>
                    <li>the execution target is still correct</li>
                    <li>the next owner is obvious after approval</li>
                  </ul>
                </article>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 8 }}>Request changes when</h3>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>the campaign direction is right but assets or rationale are weak</li>
                    <li>the operator needs revisions before launch</li>
                    <li>the workflow should stay alive but not move forward yet</li>
                  </ul>
                </article>
                <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 8 }}>Reject when</h3>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>the campaign objective or audience is wrong</li>
                    <li>the risk posture is unacceptable</li>
                    <li>the workflow should stop rather than be revised</li>
                  </ul>
                </article>
              </div>
            </section>
          ) : null}

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Escalation / operator context</h2>
              <p style={{ margin: 0 }}>{recommendedApprovalAction}</p>
            </div>
            <section
              style={{
                border: `1px solid ${escalationStyles.border}`,
                background: escalationStyles.background,
                borderRadius: 12,
                padding: 12,
                display: 'grid',
                gap: 8,
              }}
            >
              <div>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Escalation clarity</h3>
                <p style={{ margin: 0 }}>Level: <strong>{escalationLevel}</strong></p>
              </div>
              <p style={{ margin: 0 }}>{escalationSummary}</p>
            </section>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {originTask ? <Link href={`/tasks/${originTask.id}`}>Open origin task</Link> : null}
              {outcomeTask ? <Link href={`/tasks/${outcomeTask.id}`}>Open outcome task</Link> : null}
              <Link href="/knowledge">Capture decision context</Link>
            </div>
          </section>

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Workflow Transition</h2>
              <p style={{ margin: 0 }}>Make the task → approval → outcome chain visible so operators can see what this decision moved forward.</p>
            </div>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Origin Task</h3>
                {originTask ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <Link href={`/tasks/${originTask.id}`}>{originTask.title}</Link>
                    <div style={{ color: '#555' }}>{originTask.status.replaceAll('_', ' ')} · {originTask.priority}</div>
                  </div>
                ) : approval.taskId ? (
                  <p style={{ margin: 0 }}>Linked task id: {approval.taskId}</p>
                ) : (
                  <p style={{ margin: 0 }}>No origin task linked.</p>
                )}
              </section>

              <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Decision State</h3>
                <p style={{ margin: 0 }}>
                  {approval.status.replaceAll('_', ' ')}
                  {approval.nextActionLabel ? ` · ${approval.nextActionLabel}` : ''}
                </p>
              </section>

              <section style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>Outcome Task</h3>
                {outcomeTask ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <Link href={`/tasks/${outcomeTask.id}`}>{outcomeTask.title}</Link>
                    <div style={{ color: '#555' }}>{outcomeTask.status.replaceAll('_', ' ')} · {outcomeTask.priority}</div>
                  </div>
                ) : approval.outcomeTaskId ? (
                  <p style={{ margin: 0 }}>Linked task id: {approval.outcomeTaskId}</p>
                ) : (
                  <p style={{ margin: 0 }}>No follow-up task created yet.</p>
                )}
              </section>
            </div>
          </section>

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Decision History</h2>
            {decisionHistory.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
                {decisionHistory.map((entry, index) => (
                  <li key={`${String(entry.decided_at ?? index)}-${index}`}>
                    <strong>{String(entry.decision ?? 'decision').replaceAll('_', ' ')}</strong>
                    {typeof entry.decided_at === 'string' ? ` · ${entry.decided_at}` : ''}
                    {typeof entry.note === 'string' && entry.note.trim().length > 0 ? ` · ${entry.note}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0 }}>No decision history recorded yet.</p>
            )}
          </section>

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Related Memory</h2>
            <p style={{ margin: 0 }}>Approval-linked memory keeps review context, decision rationale, and handoff notes attached to this approval surface.</p>
            <MemoryEntryList initialEntries={memoryEntries} emptyMessage="No approval-linked memory captured yet." />
          </section>

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Connector Payload</h2>
            <p style={{ margin: 0 }}>Structured connector output and metadata captured on the approval record.</p>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, overflowX: 'auto' }}>
              {JSON.stringify(approval.details ?? {}, null, 2)}
            </pre>
          </section>
        </>
      )}
    </main>
  );
}
