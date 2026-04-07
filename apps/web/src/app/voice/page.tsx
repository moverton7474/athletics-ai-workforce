import { mockVoiceIntents } from '../../data/mock-voice-intents';
import { VoiceIntentCard } from '../../components/voice/VoiceIntentCard';
import { RunSponsorAttritionButton } from '../../components/voice/RunSponsorAttritionButton';
import { RunSponsorCategoryGapsButton } from '../../components/voice/RunSponsorCategoryGapsButton';
import { RunSponsorMatchAlumniButton } from '../../components/voice/RunSponsorMatchAlumniButton';
import { RunProposalCreateButton } from '../../components/voice/RunProposalCreateButton';
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
        <RecentConnectorRunsPanel />
        {mockVoiceIntents.map((intent) => (
          <VoiceIntentCard key={intent.code} intent={intent} />
        ))}
      </div>
    </main>
  );
}
