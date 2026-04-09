import Link from 'next/link';
import { OnboardingPromiseGrid } from '../components/onboarding/OnboardingPromiseGrid';

export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <h1 style={{ margin: 0 }}>athletics-ai-workforce</h1>
        <p style={{ margin: 0, maxWidth: 760 }}>
          Build a governed AI workforce for college athletics: generate the right team, organize worker workspaces, keep human approvals in the loop,
          and connect execution systems through a stable adapter layer.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/org/setup">Start workforce setup</Link>
          <Link href="/team">View generated workforce</Link>
          <Link href="/workers">Open workers</Link>
          <Link href="/dashboard">View dashboard</Link>
        </div>
      </section>
      <OnboardingPromiseGrid />
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Current product focus</h2>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li>Core workforce shell before broad connector expansion</li>
          <li>Onboarding and team generation</li>
          <li>Worker workspaces</li>
          <li>Approval-driven operating workflows</li>
          <li>Minimal strategic CSOS adapter proof</li>
        </ul>
      </section>
    </main>
  );
}
