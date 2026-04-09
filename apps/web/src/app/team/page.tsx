import Link from 'next/link';
import { TeamRecommendationPreview } from '../../components/onboarding/TeamRecommendationPreview';
import { WorkforceLaunchPlan } from '../../components/onboarding/WorkforceLaunchPlan';

const defaultProfile = {
  industry: 'College Athletics',
  targetCustomers: 'Sponsors, donors, alumni, fans',
  toneOfVoice: 'Professional, energetic, institutional',
  primaryGoals: 'Grow sponsorship revenue, improve proposal throughput, and keep leadership aligned.',
};

export default function TeamPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/org/setup">Org setup</Link>
          <Link href="/workers">Workers</Link>
        </div>
        <h1 style={{ margin: 0 }}>Generated Workforce Blueprint</h1>
        <p style={{ margin: 0, maxWidth: 760 }}>
          This is the recommended first workforce package for the athletics-ai-workforce product direction: a governed, collaborative operating team that
          can later connect to execution systems without losing the product shell.
        </p>
      </section>

      <TeamRecommendationPreview
        industry={defaultProfile.industry}
        targetCustomers={defaultProfile.targetCustomers}
        toneOfVoice={defaultProfile.toneOfVoice}
        primaryGoals={defaultProfile.primaryGoals}
      />

      <WorkforceLaunchPlan />

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>What this page should become</h2>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li>Generated roster output after onboarding intake</li>
          <li>Recommended deployment sequence for the team</li>
          <li>Clear transition into worker workspaces and governed workflows</li>
          <li>Eventual tie-in to memory, approvals, and adapter-backed integrations</li>
        </ul>
      </section>
    </main>
  );
}
