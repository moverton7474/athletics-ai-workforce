'use client';

import { useState } from 'react';
import { saveOrgProfile } from '../../lib/browser-actions';

export function OrgProfileForm() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 640 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const result = await saveOrgProfile({
          name: String(form.get('name') || ''),
          website: String(form.get('website') || ''),
          industry: String(form.get('industry') || ''),
          targetCustomers: String(form.get('targetCustomers') || ''),
          toneOfVoice: String(form.get('toneOfVoice') || ''),
        });
        setMessage(result.message);
      }}
    >
      <label>
        Organization Name
        <input type="text" name="name" placeholder="KSU Athletics" />
      </label>
      <label>
        Website
        <input type="url" name="website" placeholder="https://example.com" />
      </label>
      <label>
        Industry
        <input type="text" name="industry" placeholder="College Athletics" />
      </label>
      <label>
        Target Audiences
        <textarea name="targetCustomers" placeholder="Sponsors, donors, alumni, fans" />
      </label>
      <label>
        Tone of Voice
        <input type="text" name="toneOfVoice" placeholder="Professional, energetic, institutional" />
      </label>
      <button type="submit">Save Organization Profile</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
