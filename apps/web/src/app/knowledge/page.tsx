export const dynamic = 'force-dynamic';

import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
import { MemoryEntryCard } from '../../components/memory/MemoryEntryCard';
import { KnowledgeIngestionForm } from '../../components/knowledge/KnowledgeIngestionForm';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listKnowledgeItems } from '../../lib/services/knowledge';
import { listMemoryEntries } from '../../lib/services/memory';

export default async function KnowledgePage() {
  const [{ items, source, error }, { entries: memoryEntries, source: memorySource, error: memoryError }] = await Promise.all([
    listKnowledgeItems(),
    listMemoryEntries(),
  ]);

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
      <DataSourceNotice source={memorySource} entityLabel="Memory entries" error={memoryError} />
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Memory Architecture</h2>
          <p style={{ margin: 0 }}>Knowledge is the durable reference layer. Memory is the operational continuity layer that keeps handoffs, signals, and operator reminders alive between sessions.</p>
        </div>
        <ul style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li><strong>Organization memory</strong> keeps shared operating context, documents, and reusable institutional knowledge.</li>
          <li><strong>Worker memory</strong> keeps role-specific guidance, decisions, and role-bound operating context.</li>
          <li><strong>Personal memory</strong> keeps operator-specific support context that should not be shared too broadly.</li>
        </ul>
      </section>
      <KnowledgeIngestionForm />
      <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Recent Continuity Feed</h2>
          <p style={{ margin: 0 }}>Recent memory entries that keep tasks, handoffs, and operator guidance from disappearing between sessions.</p>
        </div>
        {memoryEntries.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {memoryEntries.slice(0, 6).map((entry) => (
              <MemoryEntryCard key={entry.id} item={entry} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>No memory entries captured yet.</p>
        )}
      </section>
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
