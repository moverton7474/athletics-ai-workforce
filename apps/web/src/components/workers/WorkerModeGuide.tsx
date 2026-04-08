export function WorkerModeGuide() {
  return (
    <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <article style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Shared Workers</h2>
        <p style={{ marginTop: 0 }}>Shared workers act as team operating surfaces. They should support collaborative workflows, common dashboards, and governed approvals.</p>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li>Visible across the organization</li>
          <li>Best for execution, coordination, and review loops</li>
          <li>Good fit for revenue, proposal, and compliance workflows</li>
        </ul>
      </article>
      <article style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Personal Workers</h2>
        <p style={{ marginTop: 0 }}>Personal workers optimize for one operator’s style, cadence, and context. They should reduce cognitive load and package work cleanly.</p>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li>Scoped to an individual’s support flow</li>
          <li>Best for prep, follow-up, and focused assistance</li>
          <li>Good fit for executive support and personalized planning</li>
        </ul>
      </article>
    </section>
  );
}
