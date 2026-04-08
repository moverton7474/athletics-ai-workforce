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
  }

  if (!canDecide) {
    return <p style={{ marginTop: 8 }}>Sign in with an owner/admin/operator membership to review approvals.</p>;
  }

  if (approvalStatus !== 'pending') {
    return <p style={{ marginTop: 8 }}>Decision recorded: {approvalStatus.replace('_', ' ')}</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        Review note
        <textarea
          aria-label="Review note"
          value={decisionNote}
          onChange={(event) => setDecisionNote(event.target.value)}
          rows={3}
          placeholder="Optional decision note"
        />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(decisionLabels).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => submitDecision(value as keyof typeof decisionLabels)}
            disabled={Boolean(loadingDecision)}
          >
            {loadingDecision === value ? 'Saving…' : label}
          </button>
        ))}
      </div>
      {decision ? <span>{decision}</span> : null}
      {error ? <span>{error}</span> : null}
    </div>
  );
}
