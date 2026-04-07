import { mockTasks } from '../../data/mock-tasks';

export function OpenTasksWidget() {
  return (
    <section>
      <h2>Open Tasks</h2>
      <ul>
        {mockTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
