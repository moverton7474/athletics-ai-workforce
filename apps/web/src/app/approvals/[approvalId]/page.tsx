export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ApprovalActions } from '../../../components/approvals/ApprovalActions';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { getCurrentUserContext } from '../../../lib/server/membership';
import { getApprovalById } from '../../../lib/services/approvals';

export default async function ApprovalDetailPage({ params }: { params: Promise<{ approvalId: string }> }) {
  const { approvalId } = await params;
  const [{ approval, source, error }, { memberships }] = await Promise.all([
    getApprovalById(approvalId),
    getCurrentUserContext(),
  ]);

  const canDecide = memberships.some((membership: any) => ['owner', 'admin', 'operator'].includes(membership.role));

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
                {approval.taskId ? <li>Origin task id: {approval.taskId}</li> : null}
                {approval.outcomeTaskId ? <li>Outcome task id: {approval.outcomeTaskId}</li> : null}
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
