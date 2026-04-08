import { recommendTeam } from '../../data/mock-team-recommendations';

export function TeamRecommendationPreview({
  industry,
  targetCustomers,
  toneOfVoice,
  primaryGoals,
}: {
  industry: string;
  targetCustomers: string;
  toneOfVoice: string;
  primaryGoals: string;
}) {
  const recommendations = recommendTeam({ industry, targetCustomers, toneOfVoice, primaryGoals });

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recommended Team</h2>
        <p style={{ margin: 0 }}>Live preview of the first workforce package based on the intake profile.</p>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {recommendations.map((member) => (
          <article key={member.roleName} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <strong>{member.name}</strong>
            <p style={{ margin: '8px 0 0 0' }}>{member.roleName} · {member.mode}</p>
            <p style={{ margin: '8px 0 8px 0' }}>{member.rationale}</p>
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
