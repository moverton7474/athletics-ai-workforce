import { mockKnowledge } from '../../data/mock-knowledge';
import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
import { KnowledgeIngestionForm } from '../../components/knowledge/KnowledgeIngestionForm';

export default function KnowledgePage() {
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Knowledge Brain</h1>
      <p>Organization, worker, and personal knowledge sources.</p>
      <KnowledgeIngestionForm />
      <div style={{ display: 'grid', gap: 16 }}>
        {mockKnowledge.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
