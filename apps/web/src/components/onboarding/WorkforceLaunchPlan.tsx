const launchPhases = [
  {
    title: 'Phase 1 — Establish the operating shell',
    items: ['Confirm org profile and workforce scope', 'Review shared vs personal worker modes', 'Open worker workspaces and tune guidelines'],
  },
  {
    title: 'Phase 2 — Start governed workflows',
    items: ['Route proposal work into approvals', 'Use task detail pages to package next actions', 'Keep dashboard and workers aligned on what is queued'],
  },
  {
    title: 'Phase 3 — Connect execution systems carefully',
    items: ['Add one live CSOS-backed read path', 'Keep connector work narrow until the shell is strong', 'Expand governed actions only after operator UX is solid'],
  },
];

export function WorkforceLaunchPlan() {
  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Launch Plan</h2>
        <p style={{ margin: 0 }}>A simple way to move from workforce recommendation into an operating system that people can actually run.</p>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {launchPhases.map((phase) => (
          <article key={phase.title} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{phase.title}</h3>
            <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
