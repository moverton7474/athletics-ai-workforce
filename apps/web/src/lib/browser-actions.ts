import { getSupabaseClient } from './supabase';

export async function saveOrgProfile(payload: {
  name: string;
  website?: string;
  industry?: string;
  targetCustomers?: string;
  toneOfVoice?: string;
}) {
  const client = getSupabaseClient();

  if (!client) {
    return { success: true, mode: 'stub', message: 'Saved locally (Supabase not configured).' };
  }

  const { error } = await client.from('organizations').insert({
    name: payload.name,
    website: payload.website,
    industry: payload.industry,
    target_customers: payload.targetCustomers,
    tone_of_voice: payload.toneOfVoice,
  });

  if (error) {
    return { success: false, mode: 'supabase', message: error.message };
  }

  return { success: true, mode: 'supabase', message: 'Organization profile saved.' };
}

export async function addKnowledgeItem(payload: {
  title: string;
  sourceType: string;
  sourceUrl?: string;
  content?: string;
}) {
  const client = getSupabaseClient();

  if (!client) {
    return { success: true, mode: 'stub', message: 'Knowledge item saved locally (Supabase not configured).' };
  }

  const { error } = await client.from('knowledge_items').insert({
    organization_id: '00000000-0000-0000-0000-000000000001',
    title: payload.title,
    source_type: payload.sourceType,
    source_url: payload.sourceUrl,
    content: payload.content,
  });

  if (error) {
    return { success: false, mode: 'supabase', message: error.message };
  }

  return { success: true, mode: 'supabase', message: 'Knowledge item added.' };
}
