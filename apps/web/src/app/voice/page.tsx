import { mockVoiceIntents } from '../../data/mock-voice-intents';
import { VoiceIntentCard } from '../../components/voice/VoiceIntentCard';
import { RunSponsorAttritionButton } from '../../components/voice/RunSponsorAttritionButton';

export default function VoicePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Voice Commands</h1>
      <p>Initial voice intent registry for the athletics workforce.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        <RunSponsorAttritionButton />
        {mockVoiceIntents.map((intent) => (
          <VoiceIntentCard key={intent.code} intent={intent} />
        ))}
      </div>
    </main>
  );
}
