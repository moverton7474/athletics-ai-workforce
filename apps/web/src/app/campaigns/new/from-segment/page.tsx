import Link from 'next/link';
import { getCampaignBuilderState } from '../../../../lib/voice-route-state';

export default async function NewCampaignFromSegmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const builderState = getCampaignBuilderState(resolvedSearchParams?.segmentKey, 'voice');

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Prefilled Campaign Builder</h1>
        <p style={{ margin: 0 }}>
          This shell shows how voice or manual segment handoff can prefill the exact same campaign builder route.
        </p>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>{builderState.campaignName}</h2>
        <p style={{ margin: '8px 0' }}>Linked segment: {builderState.linkedSegment.label}</p>
        <p style={{ margin: '8px 0' }}>Objective: {builderState.campaignObjective}</p>
        <p style={{ margin: '8px 0' }}>Prefilled fields: {builderState.prefilledFields.join(', ')}</p>
        <p style={{ margin: '8px 0' }}>Operator overrides: {builderState.operatorOverrides.join(', ') || 'None yet'}</p>
        <p style={{ margin: '8px 0 0' }}>Review route: {builderState.reviewRoute}</p>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Channel Mix</h2>
        <ul style={{ marginBottom: 0 }}>
          {builderState.selectedChannels.map((channel) => (
            <li key={channel.channel}>
              <strong>{channel.channel}</strong> — {channel.enabled ? 'enabled' : 'disabled'}
              {channel.audienceNotes ? ` · ${channel.audienceNotes}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={builderState.reviewRoute}>Open generated asset review shell</Link>
        <Link href={builderState.linkedSegment.recoverableUrl}>Back to segment detail</Link>
      </section>
    </main>
  );
}
