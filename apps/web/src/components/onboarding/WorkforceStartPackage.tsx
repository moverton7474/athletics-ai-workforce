import Link from 'next/link';
import { recommendTeam } from '../../data/mock-team-recommendations';

type WorkforceStartPackageProps = {
  orgName: string;
  industry: string;
  targetCustomers: string;
  toneOfVoice: string;
  primaryGoals: string;
};

const checklist = [
  'Confirm the org profile and onboarding promise with leadership.',
  'Open shared worker workspaces and tune their guidelines before inviting collaborators.',
  'Capture 3-5 continuity notes in the knowledge brain so the team has durable context from day one.',
  'Route the first proposal or sponsorship motion into the governed approval loop.',
  'Review the dashboard after the first workflow run and resolve the highest-priority continuity gap.',
];

export function WorkforceStartPackage({
  orgName,
  industry,
  targetCustomers,
  toneOfVoice,
  primaryGoals,
}: WorkforceStartPackageProps) {
  const recommendations = recommendTeam({ industry, targetCustomers, toneOfVoice, primaryGoals });

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Start this team</h2>
        <p style={{ margin: 0 }}>
          The first operating package for {orgName} should feel deployable right away: who owns what, what to do this week, and where to enter the app.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {recommendations.map((member) => (
          <article key={member.roleName} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>
              {member.name} ownership
            </h3>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>{member.roleName}</strong>
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              Recommended mode: <strong>{member.mode}</strong>
            </p>
            <p style={{ margin: 0 }}>Primary focus: {member.focus.slice(0, 2).join(' + ')}</p>
          </article>
        ))}
      </div>

      <article style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>First-week operating checklist</h3>
        <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
          {checklist.map((item) => (
            <li key={item} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ol>
      </article>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/workers">Launch worker setup</Link>
        <Link href="/knowledge">Seed continuity memory</Link>
        <Link href="/approvals">Open approval queue</Link>
      </div>
    </section>
  );
}
