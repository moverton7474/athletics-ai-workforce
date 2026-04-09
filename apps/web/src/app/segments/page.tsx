import Link from 'next/link';
import { getSegmentQueryState, listSegmentContexts } from '../../lib/voice-route-state';

export default async function SegmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const queryState = getSegmentQueryState(resolvedSearchParams?.q);
  const segments = listSegmentContexts();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Segments</h1>
        <p style={{ margin: 0 }}>
          Manual and voice entry point for reusable audiences like non-renewals, hot leads, and donor leads.
        </p>
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Query State</h2>
        <p style={{ margin: '8px 0' }}>
          Search text: <strong>{queryState.searchText ?? 'None yet'}</strong>
        </p>
        <p style={{ margin: '8px 0' }}>
          Suggested queries: {queryState.suggestedQueries?.join(' · ')}
        </p>
        <p style={{ margin: '8px 0 0' }}>
          This route stays usable even when voice context is missing. Deterministic filters can rebuild the segment state.
        </p>
      </section>

      <section style={{ display: 'grid', gap: 16 }}>
        {segments.map((segment) => (
          <article key={segment.segmentKey} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>{segment.label}</h2>
            <p>{segment.summary}</p>
            <p style={{ margin: '8px 0' }}>
              Audience: <strong>{segment.audienceCount ?? 'Unknown'}</strong>
              {segment.estimatedValue ? ` · Estimated value: $${segment.estimatedValue.toLocaleString()}` : ''}
            </p>
            <p style={{ margin: '8px 0' }}>Recommended objective: {segment.recommendedObjective}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/segments/${segment.segmentKey}`}>Open segment detail</Link>
              <Link href={`/campaigns/new/from-segment?segmentKey=${segment.segmentKey}`}>Build campaign from segment</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
