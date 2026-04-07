const workerCards = [
  'Chief of Staff',
  'Executive Assistant',
  'Sponsorship Intelligence',
  'Proposal & Outreach',
  'Compliance & Coordination',
];

export default function WorkersPage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Workers</h1>
      <p>Shared and personal workers will live here.</p>
      <ul>
        {workerCards.map((worker) => (
          <li key={worker}>{worker}</li>
        ))}
      </ul>
    </main>
  );
}
