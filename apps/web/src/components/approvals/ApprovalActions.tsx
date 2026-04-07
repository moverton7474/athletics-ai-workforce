'use client';

import { useState } from 'react';

export function ApprovalActions() {
  const [decision, setDecision] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
      <button type="button" onClick={() => setDecision('approved')}>Approve</button>
      <button type="button" onClick={() => setDecision('rejected')}>Reject</button>
      {decision ? <span>Decision: {decision}</span> : null}
    </div>
  );
}
