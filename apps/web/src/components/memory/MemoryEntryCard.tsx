import Link from 'next/link';
import type { MemoryEntryDTO } from '../../lib/types';
import { MemoryEntryActions } from './MemoryEntryActions';

function formatLabel(value: string) {
  return value.replaceAll('_', ' ');
}

export function MemoryEntryCard({ item }: { item: MemoryEntryDTO }) {
  return (
    <article style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Type: {formatLabel(item.memoryType)}</span>
        <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>
          Visibility: {formatLabel(item.visibilityScope)}
        </span>
        {item.pinned ? <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Pinned</span> : null}
        {item.createdAt ? <span style={{ color: '#555' }}>{new Date(item.createdAt).toLocaleString()}</span> : null}
      </div>
      <p style={{ margin: 0 }}>{item.summary ?? item.content}</p>
      {item.taskId ? (
        <p style={{ margin: 0 }}>
          Linked task: <Link href={`/tasks/${item.taskId}`}>{item.taskId}</Link>
        </p>
      ) : null}
      {item.approvalId ? (
        <p style={{ margin: 0 }}>
          Linked approval: <Link href={`/approvals/${item.approvalId}`}>{item.approvalId}</Link>
        </p>
      ) : null}
      {item.tags.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {item.tags.map((tag) => (
            <span key={tag} style={{ background: '#f5f5f5', borderRadius: 999, padding: '4px 10px' }}>
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <MemoryEntryActions item={item} />
    </article>
  );
}
