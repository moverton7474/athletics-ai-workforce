'use client';

import { useState } from 'react';

export function RunSponsorAttritionButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch('/api/connector/sponsor-attrition', {
      method: 'POST',
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Connector action failed.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? 'Sponsor attrition analysis completed.');
    setLoading(false);
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>Run first CSOS connector loop</h2>
      <p>Trigger sponsor attrition analysis and log the result into connector runs/tasks.</p>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? 'Running connector…' : 'Run sponsor attrition analysis'}
      </button>
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </section>
  );
}
