import Link from 'next/link';

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

export function WorkforceLaunchPlan({ orgName }: { orgName?: string }) {
  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Launch Plan</h2>
        <p style={{ margin: 0 }}>
          A simple way to move from workforce recommendation into an operating system that people can actually run.
          {orgName ? ` The next step for ${orgName} should be obvious, not hidden.` : ''}
        </p>
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
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            title: 'Open worker roster',
            description: 'Move from recommendation into shared vs personal worker setup.',
            href: '/workers',
            label: 'Go to workers',
          },
          {
            title: 'Review command center',
            description: 'See open tasks, approvals, continuity gaps, and recent memory in one place.',
            href: '/dashboard',
            label: 'Open dashboard',
          },
          {
            title: 'Seed continuity',
            description: 'Capture what this team should remember before deeper workflow execution starts.',
            href: '/knowledge',
            label: 'Open knowledge brain',
          },
        ].map((step) => (
          <article key={step.title} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ margin: 0 }}>{step.description}</p>
            </div>
            <Link href={step.href}>{step.label}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
