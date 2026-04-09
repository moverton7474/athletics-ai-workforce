export const dynamic = 'force-dynamic';

import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
import { KnowledgeIngestionForm } from '../../components/knowledge/KnowledgeIngestionForm';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listKnowledgeItems } from '../../lib/services/knowledge';

export default async function KnowledgePage() {
  const { items, source, error } = await listKnowledgeItems();
  const byScope = {
    organization: items.filter((item) => item.scope === 'organization'),
    worker: items.filter((item) => item.scope === 'worker'),
    personal: items.filter((item) => item.scope === 'personal'),
  };

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Knowledge Brain</h1>
        <p style={{ margin: 0 }}>Organization, worker, and personal knowledge sources.</p>
      </div>
      <DataSourceNotice source={source} entityLabel="Knowledge items" error={error} />
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Memory Architecture</h2>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li><strong>Organization memory</strong> keeps shared operating context, documents, and reusable institutional knowledge.</li>
          <li><strong>Worker memory</strong> keeps role-specific guidance and role-bound operating context.</li>
          <li><strong>Personal memory</strong> keeps operator-specific support context that should not be shared too broadly.</li>
        </ul>
      </section>
      <KnowledgeIngestionForm />
      <section style={{ display: 'grid', gap: 24 }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Organization Memory</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {byScope.organization.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: 8 }}>Worker Memory</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {byScope.worker.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: 8 }}>Personal Memory</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {byScope.personal.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
