export function CampaignWorkflowTimeline({
  events,
}: {
  events: Array<{
    label: string;
    detail?: string;
    at?: string;
  }>;
}) {
  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Workflow Timeline</h2>
        <p style={{ margin: 0 }}>Visible event trail for the campaign workflow so operators can see sequence, not just current state.</p>
      </div>

      {events.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 10 }}>
          {events.map((event, index) => (
            <li key={`${event.label}-${event.at ?? index}`}>
              <strong>{event.label}</strong>
              {event.at ? ` · ${event.at}` : ''}
              {event.detail ? <div style={{ color: '#555' }}>{event.detail}</div> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0 }}>No workflow events recorded yet.</p>
      )}
    </section>
  );
}
