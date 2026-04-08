const promiseCards = [
  {
    title: 'Generate your athletics workforce',
    description: 'Turn a simple intake into a recommended operating team with clear roles and worker workspaces.',
  },
  {
    title: 'Keep human approvals in the loop',
    description: 'Sensitive proposal and workflow actions stay reviewable, auditable, and role-aware.',
  },
  {
    title: 'Connect execution systems later',
    description: 'Build the workforce shell first, then connect CSOS and institutional systems through a stable adapter layer.',
  },
];

export function OnboardingPromiseGrid() {
  return (
    <section style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {promiseCards.map((card) => (
        <article key={card.title} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>{card.title}</h2>
          <p style={{ margin: 0 }}>{card.description}</p>
        </article>
      ))}
    </section>
  );
}
