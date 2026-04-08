import Link from 'next/link';
import { getTaskById } from '../../../lib/services/tasks';

type TaskDetailPageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;
  const task = await getTaskById(taskId);

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Link href="/tasks">← Back to tasks</Link>
        <h1 style={{ margin: 0 }}>Task Detail</h1>
      </div>
      {!task ? (
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0 }}>Task not found.</p>
        </section>
      ) : (
        <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>{task.title}</h2>
            <p style={{ margin: 0 }}>Status: {task.status} · Priority: {task.priority}</p>
          </div>
          {task.description ? <p style={{ margin: 0 }}>{task.description}</p> : null}
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {task.workerId ? <li>Assigned worker ID: {task.workerId}</li> : null}
            <li>Organization ID: {task.organizationId}</li>
            <li>Use this surface to package operator context, workflow notes, and next-step actions as the task system matures.</li>
          </ul>
        </section>
      )}
    </main>
  );
}
