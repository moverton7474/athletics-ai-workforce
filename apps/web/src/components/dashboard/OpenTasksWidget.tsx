import Link from 'next/link';
import type { TaskDTO } from '../../lib/types';

export function OpenTasksWidget({ tasks }: { tasks: TaskDTO[] }) {
  const nextActions = tasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled').slice(0, 6);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 18, display: 'grid', gap: 14, background: '#fff' }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Next Actions</h2>
        <p style={{ margin: 0, color: '#555' }}>Highest-priority operator work that still needs movement, context, or approval-aware follow-through.</p>
      </div>
      {nextActions.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {nextActions.map((task) => (
            <article key={task.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: 14, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <strong>{task.title}</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>{task.status.replaceAll('_', ' ')}</span>
                  <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>{task.priority}</span>
                </div>
              </div>
              {task.description ? <p style={{ margin: 0, color: '#555' }}>{task.description}</p> : null}
              <div>
                <Link href={`/tasks/${task.id}`}>Open task</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0 }}>No queued next actions yet.</p>
      )}
    </section>
  );
}
