export function KnowledgeCard({ item }: { item: { id: string; title: string; sourceType: string; scope: string; content?: string; sourceUrl?: string } }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, display: 'grid', gap: 8 }}>
      <h2 style={{ marginTop: 0, marginBottom: 0 }}>{item.title}</h2>
      <p style={{ margin: 0 }}>Source: {item.sourceType}</p>
      <p style={{ margin: 0 }}>Scope: {item.scope}</p>
      {item.content ? <p style={{ margin: 0 }}>{item.content}</p> : null}
      {item.sourceUrl ? (
        <a href={item.sourceUrl} target="_blank" rel="noreferrer">
          Open source
        </a>
      ) : null}
    </article>
  );
}
