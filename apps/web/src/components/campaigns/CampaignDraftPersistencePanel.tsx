'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCampaignDraft, updateCampaignDraft } from '../../lib/browser-actions';
import type { CampaignChannelConfig, GeneratedAsset } from '../../lib/types';

export function CampaignDraftPersistencePanel({
  mode,
  draftKey,
  campaignKey,
  segmentKey,
  title,
  objective,
  status,
  selectedChannels,
  assets,
  details,
}: {
  mode: 'create' | 'update';
  draftKey: string;
  campaignKey?: string;
  segmentKey: string;
  title: string;
  objective?: string;
  status?: string;
  selectedChannels: CampaignChannelConfig[];
  assets: GeneratedAsset[];
  details?: Record<string, unknown>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    const payload = {
      draftKey,
      campaignKey,
      segmentKey,
      title,
      objective,
      status,
      selectedChannels,
      assets,
      details,
    };

    const result =
      mode === 'create'
        ? await createCampaignDraft(payload)
        : await updateCampaignDraft(draftKey, {
            campaignKey,
            title,
            objective,
            status,
            selectedChannels,
            assets,
            details,
          });

    setMessage(result.message ?? null);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
      <h2 style={{ margin: 0 }}>Draft Persistence</h2>
      <p style={{ margin: 0 }}>
        {mode === 'create'
          ? 'Create or refresh the real campaign draft record for this shell.'
          : 'Update the persisted draft record from the current review state.'}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" onClick={handleClick}>
          {mode === 'create' ? 'Save draft record' : 'Update draft record'}
        </button>
      </div>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
