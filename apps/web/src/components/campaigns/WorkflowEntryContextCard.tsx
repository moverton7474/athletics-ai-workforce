export function WorkflowEntryContextCard({
  entryMode,
  voiceActionMode,
  sourceCommand,
  sourceWorker,
  confidence,
}: {
  entryMode?: string;
  voiceActionMode?: string;
  sourceCommand?: string;
  sourceWorker?: string;
  confidence?: string;
}) {
  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Entry Context</h2>
        <p style={{ margin: 0 }}>Shows how this route was opened so voice and manual entry stay grounded in the same shell state.</p>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Entry mode: {(entryMode ?? 'manual').replaceAll('_', ' ')}</li>
        {voiceActionMode ? <li>Voice action mode: {voiceActionMode.replaceAll('_', ' ')}</li> : null}
        {sourceCommand ? <li>Source command: {sourceCommand}</li> : null}
        {sourceWorker ? <li>Source worker: {sourceWorker.replaceAll('_', ' ')}</li> : null}
        {confidence ? <li>Confidence: {confidence}</li> : null}
      </ul>
    </section>
  );
}
