import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
import { KnowledgeIngestionForm } from '../../components/knowledge/KnowledgeIngestionForm';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listKnowledgeItems } from '../../lib/services/knowledge';

export default async function KnowledgePage() {
  const { items, source, error } = await listKnowledgeItems();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Knowledge Brain</h1>
      <p>Organization, worker, and personal knowledge sources.</p>
      <DataSourceNotice source={source} entityLabel="Knowledge items" error={error} />
      <KnowledgeIngestionForm />
      <div style={{ display: 'grid', gap: 16 }}>
        {items.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
