'use client';

import { useState } from 'react';

export function OrgProfileForm() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 640 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
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
      {saved ? <p>Organization profile saved locally (stub).</p> : null}
    </form>
  );
}
