'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateCampaignDraft } from '../../lib/browser-actions';

export function CampaignReviewSummaryEditor({
  draftKey,
  initialSummary,
}: {
  draftKey: string;
  initialSummary?: string;
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initialSummary ?? '');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Operator Review Summary</h2>
      <p style={{ margin: 0 }}>Edit one persisted field directly in the review shell to prove round-trip draft updates end to end.</p>
      <label style={{ display: 'grid', gap: 6 }}>
        Review Summary
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={4}
          placeholder="Summarize what is ready, what still needs revision, and what should happen next."
        />
      </label>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={async () => {
            const result = await updateCampaignDraft(draftKey, {
              status: 'ready_for_review',
              details: {
                reviewSummary: summary,
              },
            });
            setMessage(result.message ?? null);
            if (result.success) {
              router.refresh();
            }
          }}
        >
          Save review summary
        </button>
      </div>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
