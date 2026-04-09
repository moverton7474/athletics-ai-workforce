'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TeamRecommendationPreview } from '../onboarding/TeamRecommendationPreview';
import { saveOrgProfile } from '../../lib/browser-actions';

export function OrgProfileForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: 'KSU Athletics',
    website: '',
    industry: 'College Athletics',
    targetCustomers: 'Sponsors, donors, alumni, fans',
    toneOfVoice: 'Professional, energetic, institutional',
    primaryGoals: 'Grow sponsorship revenue, improve proposal throughput, and keep leadership aligned.',
  });

  const teamBlueprintHref = useMemo(() => {
    const params = new URLSearchParams({
      name: formState.name,
      website: formState.website,
      industry: formState.industry,
      targetCustomers: formState.targetCustomers,
      toneOfVoice: formState.toneOfVoice,
      primaryGoals: formState.primaryGoals,
    });

    return `/team?${params.toString()}`;
  }, [formState]);

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.2fr 1fr', alignItems: 'start' }}>
      <form
        style={{ display: 'grid', gap: 12 }}
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await saveOrgProfile({
            name: formState.name,
            website: formState.website,
            industry: formState.industry,
            targetCustomers: formState.targetCustomers,
            toneOfVoice: formState.toneOfVoice,
          });
          setMessage(result.message);
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          Organization Name
          <input
            type="text"
            name="name"
            placeholder="KSU Athletics"
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Website
          <input
            type="url"
            name="website"
            placeholder="https://example.com"
            value={formState.website}
            onChange={(event) => setFormState((current) => ({ ...current, website: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Industry
          <input
            type="text"
            name="industry"
            placeholder="College Athletics"
            value={formState.industry}
            onChange={(event) => setFormState((current) => ({ ...current, industry: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Target Audiences
          <textarea
            name="targetCustomers"
            placeholder="Sponsors, donors, alumni, fans"
            value={formState.targetCustomers}
            onChange={(event) => setFormState((current) => ({ ...current, targetCustomers: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Tone of Voice
          <input
            type="text"
            name="toneOfVoice"
            placeholder="Professional, energetic, institutional"
            value={formState.toneOfVoice}
            onChange={(event) => setFormState((current) => ({ ...current, toneOfVoice: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          Primary Goals
          <textarea
            name="primaryGoals"
            placeholder="Grow sponsorship revenue, improve proposal throughput, and keep leadership aligned."
            value={formState.primaryGoals}
            onChange={(event) => setFormState((current) => ({ ...current, primaryGoals: event.target.value }))}
          />
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit">Save Organization Profile</button>
          <Link href={teamBlueprintHref}>Continue to workforce blueprint</Link>
        </div>
        {message ? <p>{message}</p> : null}
      </form>
      <TeamRecommendationPreview
        industry={formState.industry}
        targetCustomers={formState.targetCustomers}
        toneOfVoice={formState.toneOfVoice}
        primaryGoals={formState.primaryGoals}
      />
    </div>
  );
}
