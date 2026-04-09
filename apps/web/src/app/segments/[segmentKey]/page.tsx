import Link from 'next/link';
import { getSegmentContext } from '../../../lib/voice-route-state';

export default async function SegmentDetailPage({ params }: { params: Promise<{ segmentKey: string }> }) {
  const { segmentKey } = await params;
  const segment = getSegmentContext(segmentKey);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>{segment.label}</h1>
        <p style={{ margin: 0 }}>{segment.summary}</p>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Segment Context</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>Audience count: {segment.audienceCount ?? 'Unknown'}</li>
          <li>Recoverable URL: {segment.recoverableUrl}</li>
          <li>Rationale: {segment.rationale ?? 'Not provided'}</li>
          <li>Next best action: {segment.nextBestAction ?? 'Review segment manually'}</li>
          <li>Source type: {segment.sourceType}</li>
        </ul>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Deterministic Filters</h2>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(segment.filterDefinition, null, 2)}
        </pre>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/campaigns/new/from-segment?segmentKey=${segment.segmentKey}`}>Open prefilled campaign builder</Link>
        <Link href="/segments">Back to segments</Link>
      </section>
    </main>
  );
}
