'use client';

import { useState } from 'react';

export function RunSponsorMatchAlumniButton({ disabledReason }: { disabledReason?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch('/api/connector/sponsor-match-alumni', {
      method: 'POST',
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Connector action failed.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? 'Sponsor alumni-match analysis completed.');
    setLoading(false);
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>Run third CSOS connector loop</h2>
      <p>Trigger sponsor-to-alumni matching and log the result into connector runs/tasks.</p>
      <button type="button" onClick={handleClick} disabled={loading || Boolean(disabledReason)}>
        {loading ? 'Running connector…' : 'Run sponsor alumni-match analysis'}
      </button>
      {disabledReason ? <p>{disabledReason}</p> : null}
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </section>
  );
}
