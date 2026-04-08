import { mockTasks } from '../../data/mock-tasks';
import type { TaskDTO } from '../types';
import { fetchTasks } from '../supabase-queries';

function mapTaskRow(task: any): TaskDTO {
  return {
    id: task.id,
    organizationId: task.organization_id,
    workerId: task.agent_id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  };
}

export async function listTasks() {
  const result = await fetchTasks();
  if (result.error) {
    return {
      tasks: mockTasks,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const tasks = (result.data as Array<any>).map(mapTaskRow);

  return {
    tasks,
    source: 'supabase' as const,
    error: null,
  };
}

export async function getTaskById(taskId: string) {
  const { tasks } = await listTasks();
  return tasks.find((task) => task.id === taskId) ?? null;
}
