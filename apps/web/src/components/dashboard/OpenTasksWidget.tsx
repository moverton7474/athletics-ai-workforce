type TaskSummary = {
  id: string;
  title: string;
  status: string;
};

export function OpenTasksWidget({ tasks }: { tasks: TaskSummary[] }) {
  return (
    <section>
      <h2>Open Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
