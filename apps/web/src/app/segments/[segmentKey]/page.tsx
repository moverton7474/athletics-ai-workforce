import Link from 'next/link';
import { WorkflowEntryContextCard } from '../../../components/campaigns/WorkflowEntryContextCard';
import { DataSourceNotice } from '../../../components/system/DataSourceNotice';
import { getSegmentForRouteState } from '../../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

export default async function SegmentDetailPage({ params }: { params: Promise<{ segmentKey: string }> }) {
  const { segmentKey } = await params;
  const { segment, source, error } = await getSegmentForRouteState(segmentKey);
  const isLockedWorkflow = segment.segmentKey === 'ksu-football-2026-non-renewals';

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>{segment.label}</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>{segment.summary}</p>
      </div>

      <DataSourceNotice source={source} entityLabel="Segment detail" error={error} />

      {isLockedWorkflow ? (
        <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
          <div>
            <p style={mutedLabelStyle}>Locked first live workflow</p>
            <h2 style={{ marginTop: 8, marginBottom: 8 }}>KSU Football Non-Renewals</h2>
            <p style={{ margin: 0 }}>
              This segment is now the default first bridge target for the athletics-ai-workforce ↔ CSOS MVP. The intended path is live cohort query → governed campaign builder → review → approval.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Audience count</p>
              <p style={{ margin: '8px 0 0' }}>{segment.audienceCount ?? 'Unknown'}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Estimated value</p>
              <p style={{ margin: '8px 0 0' }}>{segment.estimatedValue ? `$${segment.estimatedValue.toLocaleString()}` : 'Unknown'}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Recommended objective</p>
              <p style={{ margin: '8px 0 0' }}>{segment.recommendedObjective ?? 'Not provided'}</p>
            </article>
            <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
              <p style={mutedLabelStyle}>Workflow next step</p>
              <p style={{ margin: '8px 0 0' }}>{segment.nextBestAction ?? 'Open the campaign builder.'}</p>
            </article>
          </div>
        </section>
      ) : null}

      <WorkflowEntryContextCard
        entryMode={segment.prefillMeta.entryMode}
        voiceActionMode={segment.prefillMeta.voiceActionMode}
        sourceCommand={segment.prefillMeta.sourceCommand}
        sourceWorker={segment.prefillMeta.sourceWorker}
        confidence={segment.prefillMeta.confidence}
      />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Segment Context</h2>
          <p style={{ margin: 0 }}>This surface should make cohort provenance, rationale, and next action explicit before the operator launches downstream work.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Source type</p>
            <p style={{ margin: '8px 0 0' }}>{segment.sourceType.replaceAll('_', ' ')}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Recoverable URL</p>
            <p style={{ margin: '8px 0 0' }}>{segment.recoverableUrl}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Rationale</p>
            <p style={{ margin: '8px 0 0' }}>{segment.rationale ?? 'Not provided'}</p>
          </article>
          <article style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14 }}>
            <p style={mutedLabelStyle}>Next best action</p>
            <p style={{ margin: '8px 0 0' }}>{segment.nextBestAction ?? 'Review segment manually'}</p>
          </article>
        </div>
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Deterministic Filters</h2>
          <p style={{ margin: 0 }}>Filters must remain durable enough to rebuild this cohort even when voice/session context is gone.</p>
        </div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(segment.filterDefinition, null, 2)}
        </pre>
      </section>

      {segment.sourceType === 'csos_query' ? (
        <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>CSOS Read Path Preview</h2>
            <p style={{ margin: 0 }}>This preview confirms what records were surfaced through the current CSOS-backed read path before full adapter expansion.</p>
          </div>
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
