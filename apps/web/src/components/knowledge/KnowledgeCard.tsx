export function KnowledgeCard({ item }: { item: { id: string; title: string; sourceType: string; scope: string } }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
      <h2>{item.title}</h2>
      <p>Source: {item.sourceType}</p>
      <p>Scope: {item.scope}</p>
    </article>
  );
}
