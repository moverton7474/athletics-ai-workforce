export function VoiceIntentCard({ intent }: { intent: { code: string; label: string; workerRole: string; actionType: string } }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
      <h2>{intent.label}</h2>
      <p>Worker: {intent.workerRole}</p>
      <p>Action: {intent.actionType}</p>
      <p>Code: {intent.code}</p>
    </article>
  );
}
