'use client';

import Link from 'next/link';
import { useState } from 'react';
import { submitCampaignDraftForApproval } from '../../lib/browser-actions';

export function SubmitCampaignForApprovalButton({
  draftKey,
  existingApprovalRoute,
  existingApprovalStatus,
}: {
  draftKey: string;
  existingApprovalRoute?: string;
  existingApprovalStatus?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [approvalRoute, setApprovalRoute] = useState<string | null>(existingApprovalRoute ?? null);
  const [loading, setLoading] = useState(false);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
      <h2 style={{ margin: 0 }}>Approval Handoff</h2>
      <p style={{ margin: 0 }}>
        Route this persisted draft into a real approval record before launch or scheduling is allowed.
      </p>
      {existingApprovalStatus ? <p style={{ margin: 0 }}>Current approval status: <strong>{existingApprovalStatus}</strong></p> : null}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const result = await submitCampaignDraftForApproval(draftKey);
            setMessage(result.message ?? null);
            if (result.approvalRoute) {
              setApprovalRoute(result.approvalRoute);
            }
            setLoading(false);
          }}
        >
          {loading ? 'Routing…' : 'Submit for approval'}
        </button>
        {approvalRoute ? <Link href={approvalRoute}>Open linked approval</Link> : null}
      </div>
      {message ? <p style={{ margin: 0 }}>{message}</p> : null}
    </section>
  );
}
