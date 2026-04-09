import Link from 'next/link';
import { getCampaignBuilderState } from '../../../lib/voice-route-state';

export default function NewCampaignPage() {
  const builderState = getCampaignBuilderState('ksu-football-2026-non-renewals', 'manual');

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>New Campaign</h1>
        <p style={{ margin: 0 }}>Manual-first campaign builder shell. If no reusable segment context exists yet, start here or choose a segment first.</p>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Builder State</h2>
        <p style={{ margin: '8px 0' }}>Linked segment: {builderState.linkedSegment.label}</p>
        <p style={{ margin: '8px 0' }}>Campaign objective: {builderState.campaignObjective}</p>
        <p style={{ margin: '8px 0' }}>Missing required fields: {builderState.missingRequiredFields.join(', ') || 'None'}</p>
        <p style={{ margin: '8px 0 0' }}>Approval required: {builderState.approvalRequired ? 'Yes' : 'No'}</p>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Selected Channels</h2>
        <ul style={{ marginBottom: 0 }}>
          {builderState.selectedChannels.map((channel) => (
            <li key={channel.channel}>
              {channel.channel} — {channel.enabled ? 'enabled' : 'disabled'}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/campaigns/new/from-segment?segmentKey=${builderState.linkedSegment.segmentKey}`}>Open prefilled builder from segment</Link>
        <Link href="/segments">Choose a different segment</Link>
      </section>
    </main>
  );
}
