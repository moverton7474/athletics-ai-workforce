import Link from 'next/link';
import type { TaskDTO } from '../../lib/types';

export function TaskList({ tasks }: { tasks: TaskDTO[] }) {
  if (!tasks.length) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {tasks.map((task) => (
        <article key={task.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
          <div>
            <strong>{task.title}</strong>
            <p style={{ margin: '6px 0 0 0' }}>Status: {task.status} · Priority: {task.priority}</p>
          </div>
          {task.description ? <p style={{ margin: 0 }}>{task.description}</p> : null}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/tasks/${task.id}`}>Open task</Link>
            {task.workerId ? <span>Worker ID: {task.workerId}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
