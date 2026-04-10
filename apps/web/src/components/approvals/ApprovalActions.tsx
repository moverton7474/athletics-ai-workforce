'use client';

import { useState } from 'react';

type ApprovalActionsProps = {
  approvalId: string;
  approvalStatus: string;
  canDecide: boolean;
};

const decisionLabels = {
  approved: 'Approve',
  rejected: 'Reject',
  changes_requested: 'Request changes',
} as const;

export function ApprovalActions({ approvalId, approvalStatus, canDecide }: ApprovalActionsProps) {
  const [decisionNote, setDecisionNote] = useState('');
  const [decision, setDecision] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingDecision, setLoadingDecision] = useState<string | null>(null);

  async function submitDecision(nextDecision: keyof typeof decisionLabels) {
    setLoadingDecision(nextDecision);
    setDecision(null);
    setError(null);

    const response = await fetch(`/api/approvals/${approvalId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: nextDecision, note: decisionNote }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Approval decision failed.');
      setLoadingDecision(null);
      return;
    }

    setDecision(payload.message ?? `Decision recorded: ${nextDecision}`);
    setLoadingDecision(null);
    window.location.reload();
  }

  if (!canDecide) {
    return <p style={{ marginTop: 8 }}>Sign in with an owner/admin/operator membership to review approvals.</p>;
  }

  if (approvalStatus !== 'pending') {
    return <p style={{ marginTop: 8 }}>Decision recorded: {approvalStatus.replace('_', ' ')}</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        Review note
        <textarea
          aria-label="Review note"
          value={decisionNote}
          onChange={(event) => setDecisionNote(event.target.value)}
          rows={4}
          placeholder="Capture the rationale, guardrails, or requested changes for the next operator."
          style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12, font: 'inherit' }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => submitDecision('approved')}
          disabled={Boolean(loadingDecision)}
          style={{ border: '1px solid #86efac', background: '#ecfdf3', borderRadius: 999, padding: '8px 14px' }}
        >
          {loadingDecision === 'approved' ? 'Saving…' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => submitDecision('changes_requested')}
          disabled={Boolean(loadingDecision)}
          style={{ border: '1px solid #fdba74', background: '#fff7ed', borderRadius: 999, padding: '8px 14px' }}
        >
          {loadingDecision === 'changes_requested' ? 'Saving…' : 'Request changes'}
        </button>
        <button
          type="button"
          onClick={() => submitDecision('rejected')}
          disabled={Boolean(loadingDecision)}
          style={{ border: '1px solid #fca5a5', background: '#fef2f2', borderRadius: 999, padding: '8px 14px' }}
        >
          {loadingDecision === 'rejected' ? 'Saving…' : 'Reject'}
        </button>
      </div>
      {decision ? <span>{decision}</span> : null}
      {error ? <span>{error}</span> : null}
    </div>
  );
}
