export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ApprovalActions } from '../../../components/approvals/ApprovalActions';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { getCurrentUserContext } from '../../../lib/server/membership';
import { getApprovalById } from '../../../lib/services/approvals';
import { listTasks } from '../../../lib/services/tasks';

export default async function ApprovalDetailPage({ params }: { params: Promise<{ approvalId: string }> }) {
  const { approvalId } = await params;
  const [{ approval, source, error }, { memberships }, { tasks }] = await Promise.all([
    getApprovalById(approvalId),
    getCurrentUserContext(),
    listTasks(),
  ]);

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));
  const originTask = approval?.taskId ? tasks.find((task) => task.id === approval.taskId) ?? null : null;
  const outcomeTask = approval?.outcomeTaskId ? tasks.find((task) => task.id === approval.outcomeTaskId) ?? null : null;
  const decisionHistory = Array.isArray(approval?.details?.decision_history)
    ? approval?.details?.decision_history.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
    : [];

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

      {!approval ? (
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
