import Link from 'next/link';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { loadCsosConstituentSearchRead } from '../../lib/server/csos-read-path';
import { getSegmentQueryState } from '../../lib/voice-route-state';
import { listSegmentsForRouteState } from '../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };
const lockedWorkflowSegmentKey = 'ksu-football-2026-non-renewals';

export default async function SegmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const queryState = getSegmentQueryState(resolvedSearchParams?.q);
  const { segments, source, error } = await listSegmentsForRouteState();
  const lockedWorkflowSegment = segments.find((segment) => segment.segmentKey === lockedWorkflowSegmentKey) ?? segments[0];
  const constituentSearchPreview = queryState.searchText ? await loadCsosConstituentSearchRead(queryState.searchText) : null;

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Segments</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>
          Manual and voice entry point for reusable audiences like non-renewals, hot leads, and donor leads. This is now the front door for the first CSOS bridge MVP workflow.
        </p>
      </div>

      <DataSourceNotice source={source} entityLabel="Segments" error={error} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <p style={mutedLabelStyle}>Locked first live workflow</p>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>KSU Football Non-Renewals</h2>
          <p style={{ margin: 0 }}>
            This is the default first bridge target: query a live football recovery cohort from CSOS, turn it into a segment, then route it into governed campaign draft, review, and approval inside athletics-ai-workforce.
          </p>
        </div>

        {lockedWorkflowSegment ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Primary segment</p>
              <p style={{ margin: '8px 0 0' }}>{lockedWorkflowSegment.label}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Audience</p>
              <p style={{ margin: '8px 0 0' }}>{lockedWorkflowSegment.audienceCount ?? 'Unknown'} records</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Estimated value</p>
              <p style={{ margin: '8px 0 0' }}>{lockedWorkflowSegment.estimatedValue ? `$${lockedWorkflowSegment.estimatedValue.toLocaleString()}` : 'Unknown'}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Next action</p>
              <p style={{ margin: '8px 0 0' }}>{lockedWorkflowSegment.nextBestAction ?? 'Open segment detail and continue the workflow.'}</p>
            </article>
          </div>
        ) : null}
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Query State</h2>
          <p style={{ margin: 0 }}>This route stays usable even when voice context is missing. Deterministic filters can rebuild the segment state and keep CSOS-backed segments recoverable.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Search text</p>
            <p style={{ margin: '8px 0 0' }}>{queryState.searchText ?? 'None yet'}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Suggested queries</p>
            <p style={{ margin: '8px 0 0' }}>{queryState.suggestedQueries?.join(' · ')}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Active filter mode</p>
            <p style={{ margin: '8px 0 0' }}>{queryState.activeFilters?.segmentKind ?? 'deterministic discovery'}</p>
          </article>
        </div>
      </section>

      {constituentSearchPreview ? (
        <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
          <div>
            <p style={mutedLabelStyle}>Next bridge capability</p>
            <h2 style={{ marginTop: 8, marginBottom: 8 }}>CSOS Constituent Search Preview</h2>
            <p style={{ margin: 0 }}>{constituentSearchPreview.summary}</p>
          </div>

          {constituentSearchPreview.output.matches.length ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {constituentSearchPreview.output.matches.map((match) => (
                <article key={String(match.id)} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 8 }}>{`${String(match.firstName ?? '')} ${String(match.lastName ?? '')}`.trim() || 'Unnamed constituent'}</h3>
                  <p style={{ margin: 0 }}>Email: {String(match.email ?? 'Unknown')}</p>
                  <p style={{ margin: '8px 0 0' }}>Phone: {String(match.phone ?? 'Unknown')}</p>
                  <p style={{ margin: '8px 0 0' }}>Sport affinity: {String(match.sportAffinity ?? 'Unknown')}</p>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0 }}>No live constituent matches were returned yet. The route will still remain usable through deterministic segment discovery.</p>
          )}
        </section>
      ) : null}

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Segment Library</h2>
          <p style={{ margin: 0 }}>Segments should clearly show which ones are saved, deterministic, or CSOS-backed so operators can trust where a cohort came from before launching work.</p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {segments.map((segment) => (
            <article key={segment.segmentKey} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <p style={mutedLabelStyle}>{segment.sourceType.replaceAll('_', ' ')}</p>
                  <h3 style={{ marginTop: 8, marginBottom: 8 }}>{segment.label}</h3>
                </div>
                {segment.segmentKey === lockedWorkflowSegmentKey ? <strong>First live workflow</strong> : null}
              </div>
              <p style={{ margin: 0 }}>{segment.summary}</p>
              <p style={{ margin: '8px 0 0' }}>
                Audience: <strong>{segment.audienceCount ?? 'Unknown'}</strong>
                {segment.estimatedValue ? ` · Estimated value: $${segment.estimatedValue.toLocaleString()}` : ''}
              </p>
              <p style={{ margin: '8px 0 0' }}>Recommended objective: {segment.recommendedObjective}</p>
              <p style={{ margin: '8px 0 0' }}>Next action: {segment.nextBestAction ?? 'Review segment manually.'}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <Link href={`/segments/${segment.segmentKey}`}>Open segment detail</Link>
                <Link href={`/campaigns/new/from-segment?segmentKey=${segment.segmentKey}`}>Build campaign from segment</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
