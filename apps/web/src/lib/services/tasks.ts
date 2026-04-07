import { mockTasks } from '../../data/mock-tasks';
import { fetchTasks } from '../supabase-queries';

export async function listTasks() {
  const result = await fetchTasks();
  if (result.error) {
    return {
      tasks: mockTasks,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const tasks = (result.data as Array<any>).map((task) => ({
      id: task.id,
      organizationId: task.organization_id,
      workerId: task.agent_id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    }));

  return {
    tasks,
    source: 'supabase' as const,
    error: null,
  };
}
