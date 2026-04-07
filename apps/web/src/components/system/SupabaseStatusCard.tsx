import { getSupabaseConfig } from '../../lib/supabase';

export function SupabaseStatusCard() {
  const { configured, url } = getSupabaseConfig();

  return (
    <section
      style={{
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${configured ? '#86efac' : '#fdba74'}`,
        background: configured ? '#ecfdf3' : '#fff7ed',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Supabase Runtime Status</h2>
      <p style={{ marginBottom: 8 }}>
        {configured
          ? 'Public Supabase environment variables are present for this runtime.'
          : 'Public Supabase environment variables are missing for this runtime.'}
      </p>
      {url ? <p style={{ margin: 0 }}>Configured URL: {url}</p> : null}
    </section>
  );
}
