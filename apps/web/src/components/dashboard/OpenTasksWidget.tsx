import type { TaskDTO } from '../../lib/types';

export function OpenTasksWidget({ tasks }: { tasks: TaskDTO[] }) {
  const nextActions = tasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled').slice(0, 6);

  return (
    <section>
      <h2>Next Actions</h2>
      {nextActions.length ? (
        <ul>
          {nextActions.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status} ({task.priority})
            </li>
          ))}
        </ul>
      ) : (
        <p>No queued next actions yet.</p>
      )}
    </section>
  );
}
