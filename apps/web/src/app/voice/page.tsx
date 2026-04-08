import { mockVoiceIntents } from '../../data/mock-voice-intents';
import { VoiceIntentCard } from '../../components/voice/VoiceIntentCard';
import { RunSponsorAttritionButton } from '../../components/voice/RunSponsorAttritionButton';
import { RunSponsorCategoryGapsButton } from '../../components/voice/RunSponsorCategoryGapsButton';
import { RunSponsorMatchAlumniButton } from '../../components/voice/RunSponsorMatchAlumniButton';
import { RunProposalCreateButton } from '../../components/voice/RunProposalCreateButton';
import { RunParameterizedConnectorButton } from '../../components/voice/RunParameterizedConnectorButton';
import { RecentConnectorRunsPanel } from '../../components/voice/RecentConnectorRunsPanel';
import { getCurrentUserContext } from '../../lib/server/membership';

export default async function VoicePage() {
  const { memberships } = await getCurrentUserContext();
  const roles = memberships.map((membership: any) => membership.role);
  const canRunPrivilegedActions = roles.some((role: string) => ['owner', 'admin', 'operator'].includes(role));
  const disabledReason = canRunPrivilegedActions ? undefined : 'Sign in with an owner/admin/operator membership to run connector actions.';

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Voice Commands</h1>
      <p>Initial voice intent registry for the athletics workforce.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        <RunSponsorAttritionButton disabledReason={disabledReason} />
        <RunSponsorCategoryGapsButton disabledReason={disabledReason} />
        <RunSponsorMatchAlumniButton disabledReason={disabledReason} />
        <RunProposalCreateButton disabledReason={disabledReason} />
        <RunParameterizedConnectorButton
          title="Run proposal-view connector loop"
          description="Load the latest proposal state for a target company."
          fieldLabel="Proposal company"
          defaultValue="Acme Roofing"
          buttonLabel="Run proposal view"
          apiPath="/api/connector/proposal-view"
          bodyKey="company"
          successFallback="Proposal status loaded."
          disabledReason={disabledReason}
        />
        <RunParameterizedConnectorButton
          title="Run proposal-submit connector loop"
          description="Trigger proposal submission once human review is complete."
          fieldLabel="Submission company"
          defaultValue="Acme Roofing"
          buttonLabel="Run proposal submit"
          apiPath="/api/connector/proposal-submit"
          bodyKey="company"
          successFallback="Proposal submission completed."
          disabledReason={disabledReason}
        />
        <RunParameterizedConnectorButton
          title="Run reporting connector loop"
          description="Generate an executive-ready report from the connector path."
          fieldLabel="Report type"
          defaultValue="sponsorship-pipeline"
          buttonLabel="Run reporting"
          apiPath="/api/connector/reporting-run"
          bodyKey="reportType"
          successFallback="Report generated."
          disabledReason={disabledReason}
        />
        <RecentConnectorRunsPanel />
        {mockVoiceIntents.map((intent) => (
          <VoiceIntentCard key={intent.code} intent={intent} />
        ))}
      </div>
    </main>
  );
}
