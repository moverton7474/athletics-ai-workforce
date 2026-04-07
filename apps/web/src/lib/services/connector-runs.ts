import { fetchConnectorRuns } from '../supabase-queries';

const mockConnectorRuns = [
  { id: 'run-1', label: 'csos sponsor attrition --json', status: 'success', summary: 'Stub connector run', detail: 'Acme Roofing flagged as high-risk renewal opportunity.' },
  { id: 'run-2', label: 'csos proposal create', status: 'awaiting_approval', summary: 'Awaiting approval', detail: 'Proposal draft staged for review.' },
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
      summary:
        run.output?.reason ||
        run.output?.opportunities?.[0]?.note ||
        run.output?.category_gaps?.[0]?.note ||
        run.output?.matches?.[0]?.note ||
        run.error_text ||
        'Connector run recorded.',
      detail: JSON.stringify(run.output ?? {}, null, 2),
    }));

  return {
    runs,
    source: 'supabase' as const,
    error: null,
  };
}
