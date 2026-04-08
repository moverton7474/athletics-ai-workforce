'use client';

import { useState } from 'react';

type RunParameterizedConnectorButtonProps = {
  title: string;
  description: string;
  fieldLabel: string;
  defaultValue: string;
  buttonLabel: string;
  apiPath: string;
  bodyKey: string;
  successFallback: string;
  disabledReason?: string;
};

export function RunParameterizedConnectorButton({
  title,
  description,
  fieldLabel,
  defaultValue,
  buttonLabel,
  apiPath,
  bodyKey,
  successFallback,
  disabledReason,
}: RunParameterizedConnectorButtonProps) {
  const [value, setValue] = useState(defaultValue);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [bodyKey]: value }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? 'Connector action failed.');
      setLoading(false);
      return;
    }

    setMessage(payload.message ?? successFallback);
    setLoading(false);
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2>{title}</h2>
      <p>{description}</p>
      <label style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        {fieldLabel}
        <input aria-label={fieldLabel} value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <button type="button" onClick={handleClick} disabled={loading || Boolean(disabledReason)}>
        {loading ? 'Running connector…' : buttonLabel}
      </button>
      {disabledReason ? <p>{disabledReason}</p> : null}
      {message ? <p>{message}</p> : null}
      {error ? <p>{error}</p> : null}
    </section>
  );
}
