import { mockMemoryEntries } from '../../data/mock-memory';
import type { MemoryEntryDTO } from '../types';
import { fetchMemoryEntries } from '../supabase-queries';

function mapMemoryEntryRow(entry: any): MemoryEntryDTO {
  const metadata = entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {};
  const tags = Array.isArray(metadata.tags)
    ? metadata.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
    : [];

  return {
    id: entry.id,
    organizationId: entry.organization_id,
    workerId: entry.agent_id,
    memoryType: entry.memory_type,
    visibilityScope: entry.visibility_scope ?? 'organization',
    content: entry.content,
    summary:
      typeof metadata.summary === 'string' && metadata.summary.trim().length > 0
        ? metadata.summary
        : entry.content,
    tags,
    pinned: metadata.pinned === true,
    createdAt: entry.created_at,
  };
}

export async function listMemoryEntries() {
  const result = await fetchMemoryEntries();
  if (result.error) {
    return {
      entries: mockMemoryEntries,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const entries: MemoryEntryDTO[] = (result.data as Array<any>)
    .map(mapMemoryEntryRow)
    .sort((a, b) => Number(b.pinned === true) - Number(a.pinned === true));

  return {
    entries,
    source: 'supabase' as const,
    error: null,
  };
}

export async function listMemoryEntriesForWorker(workerId: string) {
  const result = await listMemoryEntries();
  const workerEntries = result.entries.filter((entry) => entry.workerId === workerId || !entry.workerId).slice(0, 6);

  return {
    entries: workerEntries,
    source: result.source,
    error: result.error,
  };
}
