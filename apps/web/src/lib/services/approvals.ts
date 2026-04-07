import { mockApprovals } from '../../data/mock-approvals';
import { fetchApprovals } from '../supabase-queries';

export async function listApprovals() {
  const result = await fetchApprovals();
  if (result.error) {
    return {
      approvals: mockApprovals,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const approvals = (result.data as Array<any>).map((approval) => ({
      id: approval.id,
      title: approval.title ?? approval.approval_type ?? 'Approval request',
      status: approval.status,
    }));

  return {
    approvals,
    source: 'supabase' as const,
    error: null,
  };
}
