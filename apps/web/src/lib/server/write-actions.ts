import { DEMO_ORGANIZATION_ID } from '../constants';
import type { CampaignChannelConfig, CampaignDraftRecordDTO, GeneratedAsset, MemoryEntryDTO } from '../types';
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
  scope?: string;
};

type MemoryPayload = {
  memoryType: string;
  visibilityScope?: string;
  workerId?: string;
  taskId?: string;
  approvalId?: string;
  summary?: string;
  content: string;
  tags?: string[];
};

type MemoryUpdatePayload = {
  taskId?: string;
  approvalId?: string;
  summary?: string;
  content: string;
  tags?: string[];
  pinned?: boolean;
};

type CampaignDraftPayload = {
  draftKey: string;
  campaignKey?: string;
  segmentKey: string;
  title: string;
  objective?: string;
  status?: string;
  selectedChannels?: CampaignChannelConfig[];
  assets?: GeneratedAsset[];
  details?: Record<string, unknown>;
};

type CampaignDraftUpdatePayload = {
  campaignKey?: string;
  title?: string;
  objective?: string;
  status?: string;
  selectedChannels?: CampaignChannelConfig[];
  assets?: GeneratedAsset[];
  details?: Record<string, unknown>;
};

function normalizeOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapMemoryEntryRow(entry: any): MemoryEntryDTO {
  const metadata = entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {};
  const tags = Array.isArray(metadata.tags)
    ? metadata.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
    : [];

  return {
    id: entry.id,
    organizationId: entry.organization_id,
    workerId: entry.agent_id,
    taskId: typeof metadata.taskId === 'string' ? metadata.taskId : null,
    approvalId: typeof metadata.approvalId === 'string' ? metadata.approvalId : null,
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

function mapCampaignDraftRow(draft: any): CampaignDraftRecordDTO {
  return {
    draftKey: draft.draft_key,
    campaignKey: draft.campaign_key,
    segmentKey: draft.segment_key,
    title: draft.title,
    objective: draft.objective,
    status: draft.status,
    selectedChannels: Array.isArray(draft.selected_channels) ? draft.selected_channels : [],
    assets: Array.isArray(draft.assets) ? draft.assets : [],
    details: draft.details && typeof draft.details === 'object' ? draft.details : {},
    updatedAt: draft.updated_at,
  };
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
  const sourceUrl = normalizeOptional(payload.sourceUrl);
  const title = payload.title.trim();
  const sourceType = payload.sourceType.trim();
  const content = normalizeOptional(payload.content);
  const scope = normalizeOptional(payload.scope) ?? 'organization';

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Knowledge payload validated but not persisted.',
    };
  }

  if (sourceUrl?.startsWith('validation://')) {
    const existing = await client
      .from('knowledge_items')
      .select('id')
      .eq('organization_id', DEMO_ORGANIZATION_ID)
      .eq('source_url', sourceUrl)
      .limit(1)
      .maybeSingle();

    if (existing.error) {
      return { success: false, mode: serverMode, message: existing.error.message };
    }

    if (existing.data?.id) {
      const updateResult = await client
        .from('knowledge_items')
        .update({ title, source_type: sourceType, content })
        .eq('id', existing.data.id);

      if (updateResult.error) {
        return { success: false, mode: serverMode, message: updateResult.error.message };
      }

      return {
        success: true,
        mode: serverMode,
        message: 'Knowledge validation item updated through the server action path.',
      };
    }
  }

  const { error } = await client.from('knowledge_items').insert({
    organization_id: DEMO_ORGANIZATION_ID,
    scope,
    title,
    source_type: sourceType,
    source_url: sourceUrl,
    content,
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

export async function addMemoryEntry(payload: MemoryPayload) {
  if (!payload.memoryType.trim()) {
    return { success: false, mode: 'validation', message: 'Memory type is required.' };
  }

  if (!payload.content.trim()) {
    return { success: false, mode: 'validation', message: 'Memory content is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();
  const memoryType = payload.memoryType.trim();
  const visibilityScope = normalizeOptional(payload.visibilityScope) ?? 'organization';
  const workerId = normalizeOptional(payload.workerId);
  const taskId = normalizeOptional(payload.taskId);
  const approvalId = normalizeOptional(payload.approvalId);
  const content = payload.content.trim();
  const summary = normalizeOptional(payload.summary);
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => tag.trim()).filter(Boolean)
    : [];

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Memory payload validated but not persisted.',
    };
  }

  const { data, error } = await client
    .from('memory_entries')
    .insert({
      organization_id: DEMO_ORGANIZATION_ID,
      agent_id: workerId,
      memory_type: memoryType,
      visibility_scope: visibilityScope,
      content,
      metadata: {
        summary,
        tags,
        taskId,
        approvalId,
        pinned: false,
      },
    })
    .select('*')
    .single();

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Memory entry saved through the server action path.'
        : 'Memory entry saved using the public Supabase key path.',
    entry: data ? mapMemoryEntryRow(data) : null,
  };
}

export async function updateMemoryEntry(memoryEntryId: string, payload: MemoryUpdatePayload) {
  if (!memoryEntryId.trim()) {
    return { success: false, mode: 'validation', message: 'Memory entry id is required.' };
  }

  if (!payload.content.trim()) {
    return { success: false, mode: 'validation', message: 'Memory content is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Memory update validated but not persisted.',
    };
  }

  const existing = await client
    .from('memory_entries')
    .select('metadata')
    .eq('id', memoryEntryId)
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .maybeSingle();

  if (existing.error) {
    return { success: false, mode: serverMode, message: existing.error.message };
  }

  if (!existing.data) {
    return { success: false, mode: serverMode, message: 'Memory entry not found.' };
  }

  const currentMetadata = existing.data.metadata && typeof existing.data.metadata === 'object' ? existing.data.metadata : {};
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((tag) => tag.trim()).filter(Boolean)
    : [];

  const { data, error } = await client
    .from('memory_entries')
    .update({
      content: payload.content.trim(),
      metadata: {
        ...currentMetadata,
        summary: normalizeOptional(payload.summary),
        tags,
        taskId: normalizeOptional(payload.taskId),
        approvalId: normalizeOptional(payload.approvalId),
        pinned: payload.pinned === true,
      },
    })
    .eq('id', memoryEntryId)
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .select('*')
    .single();

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Memory entry updated through the server action path.'
        : 'Memory entry updated using the public Supabase key path.',
    entry: data ? mapMemoryEntryRow(data) : null,
  };
}

export async function deleteMemory(memoryEntryId: string) {
  if (!memoryEntryId.trim()) {
    return { success: false, mode: 'validation', message: 'Memory entry id is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Memory delete validated but not persisted.',
    };
  }

  const { error } = await client
    .from('memory_entries')
    .delete()
    .eq('id', memoryEntryId)
    .eq('organization_id', DEMO_ORGANIZATION_ID);

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Memory entry deleted through the server action path.'
        : 'Memory entry deleted using the public Supabase key path.',
  };
}

export async function createCampaignDraft(payload: CampaignDraftPayload) {
  if (!payload.draftKey.trim()) {
    return { success: false, mode: 'validation', message: 'Draft key is required.' };
  }

  if (!payload.segmentKey.trim()) {
    return { success: false, mode: 'validation', message: 'Segment key is required.' };
  }

  if (!payload.title.trim()) {
    return { success: false, mode: 'validation', message: 'Campaign title is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Campaign draft payload validated but not persisted.',
    };
  }

  const { data, error } = await client
    .from('campaign_drafts')
    .upsert({
      organization_id: DEMO_ORGANIZATION_ID,
      draft_key: payload.draftKey.trim(),
      campaign_key: normalizeOptional(payload.campaignKey),
      segment_key: payload.segmentKey.trim(),
      title: payload.title.trim(),
      objective: normalizeOptional(payload.objective),
      status: normalizeOptional(payload.status) ?? 'draft',
      selected_channels: Array.isArray(payload.selectedChannels) ? payload.selectedChannels : [],
      assets: Array.isArray(payload.assets) ? payload.assets : [],
      details: payload.details ?? {},
    }, { onConflict: 'draft_key' })
    .select('*')
    .single();

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Campaign draft saved through the server action path.'
        : 'Campaign draft saved using the public Supabase key path.',
    draft: data ? mapCampaignDraftRow(data) : null,
  };
}

export async function updateCampaignDraft(draftKey: string, payload: CampaignDraftUpdatePayload) {
  if (!draftKey.trim()) {
    return { success: false, mode: 'validation', message: 'Draft key is required.' };
  }

  const client = getSupabaseServerClient();
  const serverMode = getSupabaseServerMode();

  if (!client) {
    return {
      success: true,
      mode: 'stub',
      message: 'Supabase server env vars are not configured yet. Campaign draft update validated but not persisted.',
    };
  }

  const existing = await client
    .from('campaign_drafts')
    .select('*')
    .eq('draft_key', draftKey)
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .maybeSingle();

  if (existing.error) {
    return { success: false, mode: serverMode, message: existing.error.message };
  }

  if (!existing.data) {
    return { success: false, mode: serverMode, message: 'Campaign draft not found.' };
  }

  const currentDetails = existing.data.details && typeof existing.data.details === 'object' ? existing.data.details : {};
  const mergedDetails = payload.details ? { ...currentDetails, ...payload.details } : currentDetails;

  const { data, error } = await client
    .from('campaign_drafts')
    .update({
      campaign_key: payload.campaignKey !== undefined ? normalizeOptional(payload.campaignKey) : existing.data.campaign_key,
      title: payload.title !== undefined ? payload.title.trim() : existing.data.title,
      objective: payload.objective !== undefined ? normalizeOptional(payload.objective) : existing.data.objective,
      status: payload.status !== undefined ? payload.status.trim() : existing.data.status,
      selected_channels: Array.isArray(payload.selectedChannels) ? payload.selectedChannels : existing.data.selected_channels,
      assets: Array.isArray(payload.assets) ? payload.assets : existing.data.assets,
      details: mergedDetails,
      updated_at: new Date().toISOString(),
    })
    .eq('draft_key', draftKey)
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .select('*')
    .single();

  if (error) {
    return { success: false, mode: serverMode, message: error.message };
  }

  return {
    success: true,
    mode: serverMode,
    message:
      serverMode === 'service_role'
        ? 'Campaign draft updated through the server action path.'
        : 'Campaign draft updated using the public Supabase key path.',
    draft: data ? mapCampaignDraftRow(data) : null,
  };
}
