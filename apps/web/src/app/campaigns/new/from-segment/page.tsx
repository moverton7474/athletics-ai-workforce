import Link from 'next/link';
import { CampaignDraftPersistencePanel } from '../../../../components/campaigns/CampaignDraftPersistencePanel';
import { WorkflowEntryContextCard } from '../../../../components/campaigns/WorkflowEntryContextCard';
import { DataSourceNotice } from '../../../../components/system/DataSourceNotice';
import { getCampaignBuilderForRouteState } from '../../../../lib/services/route-state';

const sectionStyle = { border: '1px solid #ddd', borderRadius: 12, padding: 16 };
const mutedLabelStyle = { fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: '#555', margin: 0 };

export default async function NewCampaignFromSegmentPage({
  searchParams,
}: {
  searchParams?: Promise<{ segmentKey?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { builderState, draftRecord, source, error } = await getCampaignBuilderForRouteState(resolvedSearchParams?.segmentKey, 'voice');
  const draftKey = builderState.draftId ?? `${builderState.linkedSegment.segmentKey}-draft`;
  const enabledChannels = builderState.selectedChannels.filter((channel) => channel.enabled);
  const disabledChannels = builderState.selectedChannels.filter((channel) => !channel.enabled);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Prefilled Campaign Builder</h1>
        <p style={{ margin: 0, maxWidth: 860 }}>
          This route turns a segment or voice handoff into a governed campaign draft so the operator can review what was generated,
          decide what to change, and route only approved work forward.
        </p>
      </div>

      <DataSourceNotice source={source} entityLabel="Campaign builder" error={error} />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <p style={mutedLabelStyle}>Campaign builder</p>
          <h2 style={{ marginTop: 8, marginBottom: 8 }}>{builderState.campaignName}</h2>
          <p style={{ margin: 0, maxWidth: 860 }}>{builderState.linkedSegment.summary}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Linked segment</p>
            <p style={{ margin: '8px 0 0' }}>{builderState.linkedSegment.label}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Recommended objective</p>
            <p style={{ margin: '8px 0 0' }}>{builderState.campaignObjective}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Audience size</p>
            <p style={{ margin: '8px 0 0' }}>{builderState.linkedSegment.audienceCount ?? 'Unknown'} records</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <p style={mutedLabelStyle}>Draft status</p>
            <p style={{ margin: '8px 0 0' }}>
              <strong>{draftRecord.status}</strong>
            </p>
          </article>
        </div>
      </section>

      <WorkflowEntryContextCard
        entryMode={builderState.prefillMeta.entryMode}
        voiceActionMode={builderState.prefillMeta.voiceActionMode}
        sourceCommand={builderState.prefillMeta.sourceCommand}
        sourceWorker={builderState.prefillMeta.sourceWorker}
        confidence={builderState.prefillMeta.confidence}
      />

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Builder Progress</h2>
          <p style={{ margin: 0 }}>The route is structured to preserve segment context, show what the system prefilled, and keep launch-sensitive steps reviewable.</p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {[
            {
              step: 'Step 1',
              title: 'Confirm segment and objective',
              body: `Working from ${builderState.linkedSegment.label} with the objective: ${builderState.campaignObjective}`,
            },
            {
              step: 'Step 2',
              title: 'Review channel mix and operator changes',
              body: `${enabledChannels.length} channel(s) enabled${disabledChannels.length ? `, ${disabledChannels.length} held back` : ''}.`,
            },
            {
              step: 'Step 3',
              title: 'Generate assets into review',
              body: 'The next route groups channel assets for human review before approval handoff.',
            },
            {
              step: 'Step 4',
              title: 'Approval before launch-sensitive execution',
              body: builderState.approvalRequired
                ? 'This campaign requires explicit approval before launch or sensitive outbound execution.'
                : 'Approval is not currently required, but the shell still keeps review state visible.',
            },
          ].map((item) => (
            <article key={item.title} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
              <p style={mutedLabelStyle}>{item.step}</p>
              <h3 style={{ marginTop: 8, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ margin: 0 }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Segment Handoff Context</h2>
          <p style={{ margin: 0 }}>
            This campaign should stay anchored to a recoverable segment definition rather than becoming a disconnected prompt artifact.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Why this audience</h3>
            <p style={{ margin: 0 }}>{builderState.linkedSegment.rationale ?? builderState.linkedSegment.summary}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Recommended next action</h3>
            <p style={{ margin: 0 }}>{builderState.linkedSegment.nextBestAction ?? 'Move this segment into a governed outreach draft.'}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Recoverable route</h3>
            <p style={{ margin: 0 }}>{builderState.linkedSegment.recoverableUrl}</p>
          </article>
        </div>
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Channel Strategy</h2>
          <p style={{ margin: 0 }}>Channel selection stays explicit here so operators can control outreach posture before assets move into review.</p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {builderState.selectedChannels.map((channel) => (
            <article key={channel.channel} style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>{channel.channel}</h3>
                <strong>{channel.enabled ? 'Enabled for draft generation' : 'Held back until operator enables'}</strong>
              </div>
              <p style={{ margin: '8px 0 0' }}>{channel.objective ?? 'No channel-specific objective recorded yet.'}</p>
              <p style={{ margin: '8px 0 0' }}>{channel.audienceNotes ?? 'No audience notes captured yet.'}</p>
              <p style={{ margin: '8px 0 0' }}>Target assets: {channel.assetCountTarget ?? 0}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Operator Control & Governance</h2>
          <p style={{ margin: 0 }}>
            The system can prefill and draft, but the operator still owns overrides, review posture, and approval before consequential execution.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Prefilled by the system</h3>
            <p style={{ margin: 0 }}>{builderState.prefilledFields.join(', ') || 'No fields were prefilled.'}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Operator overrides</h3>
            <p style={{ margin: 0 }}>{builderState.operatorOverrides.join(', ') || 'No overrides recorded yet.'}</p>
          </article>
          <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Missing required fields</h3>
            <p style={{ margin: 0 }}>{builderState.missingRequiredFields.join(', ') || 'No blocking fields missing right now.'}</p>
          </article>
        </div>

        <article style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Launch governance posture</h3>
          <p style={{ margin: 0 }}>
            {builderState.approvalRequired
              ? 'Generated assets can move into review next, but launch-sensitive actions should remain blocked until explicit approval is recorded.'
              : 'This route does not currently require approval, but the workflow shell still preserves review and decision history.'}
          </p>
          {builderState.operatorNotes ? <p style={{ margin: '8px 0 0' }}>Operator notes: {builderState.operatorNotes}</p> : null}
          <p style={{ margin: '8px 0 0' }}>Draft key: {draftRecord.draftKey}</p>
          <p style={{ margin: '8px 0 0' }}>Last updated: {draftRecord.updatedAt ?? 'Not persisted yet'}</p>
          <p style={{ margin: '8px 0 0' }}>Review route: {builderState.reviewRoute}</p>
        </article>
      </section>

      <CampaignDraftPersistencePanel
        mode={source === 'supabase' ? 'update' : 'create'}
        actionLabel="Save draft record"
        draftKey={draftKey}
        campaignKey={builderState.campaignId ?? `${builderState.linkedSegment.segmentKey}-campaign`}
        segmentKey={builderState.linkedSegment.segmentKey}
        title={builderState.campaignName ?? 'Campaign draft'}
        objective={builderState.campaignObjective}
        status="draft"
        selectedChannels={builderState.selectedChannels}
        assets={[]}
        details={{
          campaignName: builderState.campaignName,
          operatorNotes: builderState.operatorNotes,
          prefilledFields: builderState.prefilledFields,
          operatorOverrides: builderState.operatorOverrides,
          missingRequiredFields: builderState.missingRequiredFields,
          approvalRequired: builderState.approvalRequired,
          entryMode: builderState.prefillMeta.entryMode,
          voiceActionMode: builderState.prefillMeta.voiceActionMode,
          sourceCommand: builderState.prefillMeta.sourceCommand,
          sourceWorker: builderState.prefillMeta.sourceWorker,
          confidence: builderState.prefillMeta.confidence,
        }}
      />

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={builderState.reviewRoute}>Open generated asset review shell</Link>
        <Link href={builderState.linkedSegment.recoverableUrl}>Back to segment detail</Link>
      </section>
    </main>
  );
}
