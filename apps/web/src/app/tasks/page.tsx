export const dynamic = 'force-dynamic';

import { TaskList } from '../../components/tasks/TaskList';
import { DataSourceNotice } from '../../components/system/DataSourceNotice';
import { listTasks } from '../../lib/services/tasks';

export default async function TasksPage() {
  const { tasks, source, error } = await listTasks();

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif', display: 'grid', gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Tasks</h1>
        <p style={{ margin: 0 }}>Task queue, approvals, and workflow execution status.</p>
      </div>
      <DataSourceNotice source={source} entityLabel="Tasks" error={error} />
      <TaskList tasks={tasks} />
    </main>
  );
}
