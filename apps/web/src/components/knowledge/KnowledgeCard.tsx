export function KnowledgeCard({ item }: { item: { id: string; title: string; sourceType: string; scope: string } }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>{item.title}</h2>
      <p style={{ margin: '0 0 6px 0' }}>Source: {item.sourceType}</p>
      <p style={{ margin: 0 }}>Scope: {item.scope}</p>
    </article>
  );
}
