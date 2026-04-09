import Link from 'next/link';

export function VoiceIntentCard({
  intent,
}: {
  intent: {
    code: string;
    label: string;
    workerRole: string;
    actionType: string;
    route: string;
    routeState: string;
    approvalGate: string;
    fallback: string;
  };
}) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, display: 'grid', gap: 8 }}>
      <h2 style={{ margin: 0 }}>{intent.label}</h2>
      <p style={{ margin: 0 }}>Worker: {intent.workerRole}</p>
      <p style={{ margin: 0 }}>Action: {intent.actionType}</p>
      <p style={{ margin: 0 }}>Route state: {intent.routeState}</p>
      <p style={{ margin: 0 }}>Approval gate: {intent.approvalGate}</p>
      <p style={{ margin: 0 }}>Manual fallback: {intent.fallback}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={intent.route}>Open mapped route</Link>
        <span>Code: {intent.code}</span>
      </div>
    </article>
  );
}
