import { mockKnowledge } from '../../data/mock-knowledge';
import { fetchKnowledgeItems } from '../supabase-queries';

export async function listKnowledgeItems() {
  const result = await fetchKnowledgeItems();
  if (result.error) {
    return {
      items: mockKnowledge,
      source: 'mock' as const,
      error: result.error,
    };
  }

  const items = (result.data as Array<any>).map((item) => ({
      id: item.id,
      title: item.title ?? 'Untitled knowledge item',
      sourceType: item.source_type,
      scope: item.scope,
    }));

  return {
    items,
    source: 'supabase' as const,
    error: null,
  };
}
