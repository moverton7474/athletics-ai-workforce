import { mockTasks } from '../../data/mock-tasks';
import { fetchTasks } from '../supabase-queries';

export async function listTasks() {
  const result = await fetchTasks();
  if (result.error || !result.data.length) {
    return mockTasks;
  }
  return result.data;
}
