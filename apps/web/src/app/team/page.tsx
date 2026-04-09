import Link from 'next/link';
import { TeamRecommendationPreview } from '../../components/onboarding/TeamRecommendationPreview';
import { WorkforceLaunchPlan } from '../../components/onboarding/WorkforceLaunchPlan';

const defaultProfile = {
  name: 'KSU Athletics',
  website: '',
  industry: 'College Athletics',
  targetCustomers: 'Sponsors, donors, alumni, fans',
  toneOfVoice: 'Professional, energetic, institutional',
  primaryGoals: 'Grow sponsorship revenue, improve proposal throughput, and keep leadership aligned.',
};

type TeamPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchParamValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const profile = {
    name: getSearchParamValue(resolvedSearchParams.name, defaultProfile.name),
    website: getSearchParamValue(resolvedSearchParams.website, defaultProfile.website),
    industry: getSearchParamValue(resolvedSearchParams.industry, defaultProfile.industry),
    targetCustomers: getSearchParamValue(resolvedSearchParams.targetCustomers, defaultProfile.targetCustomers),
    toneOfVoice: getSearchParamValue(resolvedSearchParams.toneOfVoice, defaultProfile.toneOfVoice),
    primaryGoals: getSearchParamValue(resolvedSearchParams.primaryGoals, defaultProfile.primaryGoals),
  };

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/">Home</Link>
          <Link href="/org/setup">Org setup</Link>
          <Link href="/workers">Workers</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <h1 style={{ margin: 0 }}>Generated Workforce Blueprint</h1>
        <p style={{ margin: 0, maxWidth: 760 }}>
          This is the recommended first workforce package for the athletics-ai-workforce product direction: a governed, collaborative operating team that
          can later connect to execution systems without losing the product shell.
        </p>
      </section>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 16,
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <article>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Blueprint for {profile.name}</h2>
          <p style={{ margin: 0 }}>{profile.primaryGoals}</p>
        </article>
        <article>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Audience</h3>
          <p style={{ margin: 0 }}>{profile.targetCustomers}</p>
        </article>
        <article>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Voice + positioning</h3>
          <p style={{ margin: 0 }}>{profile.toneOfVoice}</p>
          {profile.website ? <p style={{ margin: '8px 0 0 0' }}>Website: {profile.website}</p> : null}
        </article>
      </section>

      <TeamRecommendationPreview
        industry={profile.industry}
        targetCustomers={profile.targetCustomers}
        toneOfVoice={profile.toneOfVoice}
        primaryGoals={profile.primaryGoals}
      />

      <WorkforceLaunchPlan orgName={profile.name} />

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
