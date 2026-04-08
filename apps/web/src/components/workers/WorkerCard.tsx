import Link from 'next/link';
import type { WorkerDTO } from '../../lib/types';

export function WorkerCard({ worker }: { worker: WorkerDTO }) {
  return (
    <article style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, display: 'grid', gap: 10 }}>
      <div>
        <h2 style={{ margin: 0 }}>{worker.name}</h2>
        <p style={{ margin: '6px 0 0 0' }}>{worker.roleName}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Mode: {worker.mode}</span>
        <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Status: {worker.status}</span>
      </div>
      <p style={{ margin: 0 }}>
        {worker.mode === 'shared'
          ? 'Shared worker: designed for collaborative operating workflows and team-visible actions.'
          : 'Personal worker: designed to support one operator with focused prep, planning, and follow-through.'}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href={`/workers/${worker.id}`}>Open chat</Link>
        <Link href={`/workers/${worker.id}/outputs`}>Outputs</Link>
        <Link href={`/workers/${worker.id}/guidelines`}>Guidelines</Link>
        <Link href={`/workers/${worker.id}/settings`}>Settings</Link>
      </div>
    </article>
  );
}
