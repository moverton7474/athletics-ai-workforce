import { DEMO_ORGANIZATION_ID } from '../constants';
import { getSupabaseServerClient, getSupabaseServerMode } from './supabase-admin';

type OrgProfilePayload = {
  name: string;
  website?: string;
  industry?: string;
  targetCustomers?: string;
  toneOfVoice?: string;
};

type KnowledgePayload = {
  title: string;
  sourceType: string;
  sourceUrl?: string;
  content?: string;
};

function normalizeOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function saveOrgProfile(payload: OrgProfilePayload) {
  if (!payload.name.trim()) {
    return { success: false, mode: 'validation', message: 'Organization name is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Form payload validated but not persisted.',
    };
  }

  const { error } = await client.from('organizations').upsert({
    id: DEMO_ORGANIZATION_ID,
    name: payload.name.trim(),
    website: normalizeOptional(payload.website),
    industry: normalizeOptional(payload.industry),
    target_customers: normalizeOptional(payload.targetCustomers),
    tone_of_voice: normalizeOptional(payload.toneOfVoice),
  });

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Organization profile saved through the server action path.'
        : 'Organization profile saved using the public Supabase key path.',
  };
}

export async function addKnowledgeItem(payload: KnowledgePayload) {
  if (!payload.title.trim()) {
    return { success: false, mode: 'validation', message: 'Knowledge title is required.' };
  }

  if (!payload.sourceType.trim()) {
    return { success: false, mode: 'validation', message: 'Knowledge source type is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Knowledge payload validated but not persisted.',
    };
  }

  const { error } = await client.from('knowledge_items').insert({
    organization_id: DEMO_ORGANIZATION_ID,
    scope: 'organization',
    title: payload.title.trim(),
    source_type: payload.sourceType.trim(),
    source_url: normalizeOptional(payload.sourceUrl),
    content: normalizeOptional(payload.content),
  });

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Knowledge item saved through the server action path.'
        : 'Knowledge item saved using the public Supabase key path.',
  };
}
