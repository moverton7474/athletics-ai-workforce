import { recommendTeam } from '../../data/mock-team-recommendations';

type WorkforceDeploymentSequenceProps = {
  industry: string;
  targetCustomers: string;
  toneOfVoice: string;
  primaryGoals: string;
};

const sequenceLabels = [
  'Start first',
  'Add next',
  'Layer in third',
  'Expand fourth',
  'Stabilize fifth',
] as const;

export function WorkforceDeploymentSequence({
  industry,
  targetCustomers,
  toneOfVoice,
  primaryGoals,
}: WorkforceDeploymentSequenceProps) {
  const recommendations = recommendTeam({ industry, targetCustomers, toneOfVoice, primaryGoals });
  const sharedWorkers = recommendations.filter((member) => member.mode === 'shared');
  const personalWorkers = recommendations.filter((member) => member.mode === 'personal');

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recommended rollout sequence</h2>
        <p style={{ margin: 0 }}>
          The first launch should not feel like five disconnected workers. This sequence turns the recommended team into a controlled operating package.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <article style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Shared workers</h3>
          <p style={{ margin: 0 }}>{sharedWorkers.length} recommended for governed team use.</p>
        </article>
        <article style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Personal workers</h3>
          <p style={{ margin: 0 }}>{personalWorkers.length} recommended for leader-specific support.</p>
        </article>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {recommendations.map((member, index) => (
          <article key={member.roleName} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <p style={{ marginTop: 0, marginBottom: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {sequenceLabels[index] ?? 'Deploy'}
            </p>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>
              {member.name} · {member.roleName}
            </h3>
            <p style={{ margin: '0 0 8px 0' }}>{member.rationale}</p>
            <p style={{ margin: '0 0 10px 0' }}>
              Mode: <strong>{member.mode}</strong>
            </p>
            <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
              {member.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
