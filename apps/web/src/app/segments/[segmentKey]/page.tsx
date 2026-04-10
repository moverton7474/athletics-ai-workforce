import Link from 'next/link';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { getSegmentForRouteState } from '../../../lib/services/route-state';

export default async function SegmentDetailPage({ params }: { params: Promise<{ segmentKey: string }> }) {
  const { segmentKey } = await params;
  const { segment, source, error } = await getSegmentForRouteState(segmentKey);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>{segment.label}</h1>
        <p style={{ margin: 0 }}>{segment.summary}</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Segment detail" error={error} />

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

      {segment.sourceType === 'csos_query' ? (
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>CSOS Read Path Preview</h2>
          {segment.sourceRecordIds?.length ? (
            <ul style={{ marginBottom: 0 }}>
              {segment.sourceRecordIds.map((recordId) => (
                <li key={recordId}>{recordId}</li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No live opportunity names were returned yet.</p>
          )}
        </section>
      ) : null}

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/campaigns/new/from-segment?segmentKey=${segment.segmentKey}`}>Open prefilled campaign builder</Link>
        <Link href="/segments">Back to segments</Link>
      </section>
    </main>
  );
}
