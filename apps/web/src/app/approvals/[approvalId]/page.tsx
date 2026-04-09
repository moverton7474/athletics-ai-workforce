export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ApprovalActions } from '../../../components/approvals/ApprovalActions';
import { MemoryEntryList } from '../../../components/memory/MemoryEntryList';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { getCurrentUserContext } from '../../../lib/server/membership';
import { getApprovalDecisionState } from '../../../lib/voice-route-state';
import { getApprovalById } from '../../../lib/services/approvals';
import { listMemoryEntriesForApproval } from '../../../lib/services/memory';
import { listTasks } from '../../../lib/services/tasks';

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

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));
  const fallbackState = !approval ? getApprovalDecisionState(approvalId, resolvedSearchParams?.segmentKey) : null;
  const originTask = approval?.taskId ? tasks.find((task) => task.id === approval.taskId) ?? null : null;
  const outcomeTask = approval?.outcomeTaskId ? tasks.find((task) => task.id === approval.outcomeTaskId) ?? null : null;
  const decisionHistory = Array.isArray(approval?.details?.decision_history)
    ? approval?.details?.decision_history.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
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

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Approval Review</h1>
          <p style={{ margin: 0 }}>Review workflow context, connector payloads, and the decision state for this approval.</p>
        </div>
        <Link href="/approvals">Back to approvals</Link>
      </div>

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
          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>{approval.title}</h2>
              <p style={{ margin: 0 }}>
                Status: {approval.status.replaceAll('_', ' ')} · Type: {approval.approvalType.replaceAll('_', ' ')}
              </p>
            </div>

            {approval.summary ? <p style={{ margin: 0 }}>{approval.summary}</p> : null}

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

          <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Operator Next Action</h2>
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
