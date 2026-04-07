import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listTasks } from '../../lib/services/tasks';

export default async function TasksPage() {
  const { tasks, source, error } = await listTasks();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Tasks</h1>
      <p>Task queue, approvals, and workflow execution status.</p>
      <DataSourceNotice source={source} entityLabel="Tasks" error={error} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 16 }}>
            <strong>{task.title}</strong> — {task.status} ({task.priority})
            {task.description ? <p>{task.description}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
