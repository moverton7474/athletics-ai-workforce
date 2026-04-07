'use client';

import { useState } from 'react';

export function RunProposalCreateButton({ disabledReason }: { disabledReason?: string }) {
  const [company, setCompany] = useState('Acme Roofing');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch('/api/connector/proposal-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Connector action failed.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? 'Proposal draft created.');
    setLoading(false);
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>Run proposal-create connector loop</h2>
      <p>Draft the next proposal package through the connector path.</p>
      <label style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        Company
        <input value={company} onChange={(event) => setCompany(event.target.value)} />
      </label>
      <button type="button" onClick={handleClick} disabled={loading || Boolean(disabledReason)}>
        {loading ? 'Running connector…' : 'Run proposal create'}
      </button>
      {disabledReason ? <p>{disabledReason}</p> : null}
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </section>
  )
}
