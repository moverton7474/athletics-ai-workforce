import Link from 'next/link';
import { OnboardingPromiseGrid } from '../../../components/onboarding/OnboardingPromiseGrid';
import { OrgProfileForm } from '../../../components/org/OrgProfileForm';

export default function OrgSetupPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        <Link href="/">← Back to home</Link>
        <h1 style={{ margin: 0 }}>Build Your Athletics Workforce</h1>
        <p style={{ margin: 0 }}>
          Capture the organization profile, preview the recommended team, and shape the first worker package before deep connector work.
        </p>
      </div>
      <OnboardingPromiseGrid />
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Organization Intake</h2>
          <p style={{ margin: 0 }}>
            This intake should become the first step in the onboarding funnel: define the org, recommend the team, then move into worker workspaces.
          </p>
        </div>
        <OrgProfileForm />
      </section>
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Next onboarding milestone</h2>
        <p style={{ margin: '0 0 8px 0' }}>After intake, the product should hand the user into a generated workforce plan rather than dropping them into disconnected pages.</p>
        <Link href="/team">Open generated workforce blueprint</Link>
      </section>
    </main>
  );
}
