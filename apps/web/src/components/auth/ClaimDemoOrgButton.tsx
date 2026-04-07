'use client';

import { useState } from 'react';

export function ClaimDemoOrgButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch('/api/auth/bootstrap-membership', {
      method: 'POST',
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Failed to claim demo organization membership.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? 'Demo organization membership granted.');
    setLoading(false);
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? 'Claiming demo org…' : 'Claim demo organization'}
      </button>
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </div>
  );
}
