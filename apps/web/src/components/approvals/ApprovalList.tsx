import type { ApprovalDTO } from '../../lib/types';
import { ApprovalActions } from './ApprovalActions';

export function ApprovalList({ approvals, canDecide }: { approvals: ApprovalDTO[]; canDecide: boolean }) {
  if (!approvals.length) {
    return <p>No approval requests yet.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {approvals.map((approval) => {
        const company = typeof approval.details?.company === 'string' ? approval.details.company : null;
        const stage = typeof approval.details?.stage === 'string' ? approval.details.stage : null;
        const nextAction =
          typeof approval.details?.recommended_next_action === 'string'
            ? approval.details.recommended_next_action
            : null;

        return (
          <article key={approval.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <div>
                <strong>{approval.title}</strong>
                <p style={{ margin: '6px 0 0 0' }}>
                  Status: {approval.status.replace('_', ' ')} · Type: {approval.approvalType.replace('_', ' ')}
                </p>
              </div>
              {approval.summary ? <p style={{ margin: 0 }}>{approval.summary}</p> : null}
              {(company || stage || nextAction) ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {company ? <li>Company: {company}</li> : null}
                  {stage ? <li>Stage: {stage.replace('_', ' ')}</li> : null}
                  {nextAction ? <li>Recommended next action: {nextAction}</li> : null}
                </ul>
              ) : null}
              {approval.decisionNote ? <p style={{ margin: 0 }}>Decision note: {approval.decisionNote}</p> : null}
              <ApprovalActions approvalId={approval.id} approvalStatus={approval.status} canDecide={canDecide} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
