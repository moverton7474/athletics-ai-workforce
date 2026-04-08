import type { ConnectorRunDTO } from '../types';
import { fetchConnectorRuns } from '../supabase-queries';

const mockConnectorRuns: ConnectorRunDTO[] = [
  { id: 'run-1', label: 'csos sponsor attrition --json', status: 'success', summary: 'Acme Roofing flagged as a high-risk renewal opportunity.' },
  { id: 'run-2', label: 'csos proposal create', status: 'awaiting_approval', summary: 'Proposal draft staged and routed into approvals.' },
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

  const runs: ConnectorRunDTO[] = (result.data as Array<any>).map((run) => ({
    id: run.id,
    label: run.connector_name,
    status: run.status,
    summary:
      run.output?.proposal?.summary ||
      run.output?.report?.note ||
      run.output?.reason ||
      run.output?.opportunities?.[0]?.note ||
      run.output?.category_gaps?.[0]?.note ||
      run.output?.matches?.[0]?.note ||
      run.error_text ||
      'Connector run recorded.',
    detail: JSON.stringify(run.output ?? {}, null, 2),
    createdAt: run.created_at,
  }));

  return {
    runs,
    source: 'supabase' as const,
    error: null,
  };
}
