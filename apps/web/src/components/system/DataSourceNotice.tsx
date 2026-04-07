type DataSourceNoticeProps = {
  source: 'mock' | 'supabase';
  entityLabel: string;
  error?: string | null;
};

export function DataSourceNotice({ source, entityLabel, error }: DataSourceNoticeProps) {
  return (
    <p
      style={{
        padding: '10px 12px',
        borderRadius: 10,
        background: source === 'supabase' ? '#ecfdf3' : '#fff7ed',
        border: `1px solid ${source === 'supabase' ? '#86efac' : '#fdba74'}`,
      }}
    >
      {source === 'supabase'
        ? `${entityLabel} are loading from live Supabase data.`
        : `${entityLabel} are currently falling back to seeded/mock data.`}
      {error ? ` (${error})` : ''}
    </p>
  );
}
