import { fetchConnectorRuns } from '../supabase-queries';

const mockConnectorRuns = [
  { id: 'run-1', label: 'csos sponsor attrition --json', status: 'success' },
  { id: 'run-2', label: 'csos proposal create', status: 'awaiting_approval' },
];

export async function listConnectorRuns() {
  const result = await fetchConnectorRuns();
  if (result.error) {
    return {
      runs: mockConnectorRuns,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const runs = (result.data as Array<any>).map((run) => ({
      id: run.id,
      label: run.connector_name,
      status: run.status,
    }));

  return {
    runs,
    source: 'supabase' as const,
    error: null,
  };
}
