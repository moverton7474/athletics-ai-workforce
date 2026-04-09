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
  selectedChannels?: unknown[];
  assets?: unknown[];
  details?: Record<string, unknown>;
};

type CampaignDraftUpdatePayload = {
  campaignKey?: string;
  title?: string;
  objective?: string;
  status?: string;
  selectedChannels?: unknown[];
  assets?: unknown[];
  details?: Record<string, unknown>;
};

async function sendJson(path: string, method: 'POST' | 'PATCH' | 'DELETE', payload?: unknown) {
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  return response.json();
}

async function postJson(path: string, payload: unknown) {
  return sendJson(path, 'POST', payload);
}

export async function saveOrgProfile(payload: OrgProfilePayload) {
  return postJson('/api/org-profile', payload);
}

export async function addKnowledgeItem(payload: KnowledgePayload) {
  return postJson('/api/knowledge-items', payload);
}

export async function addMemoryEntry(payload: MemoryPayload) {
  return postJson('/api/memory-entries', payload);
}

export async function updateMemoryEntry(memoryEntryId: string, payload: MemoryUpdatePayload) {
  return sendJson(`/api/memory-entries/${memoryEntryId}`, 'PATCH', payload);
}

export async function deleteMemoryEntry(memoryEntryId: string) {
  return sendJson(`/api/memory-entries/${memoryEntryId}`, 'DELETE');
}

export async function createCampaignDraft(payload: CampaignDraftPayload) {
  return postJson('/api/campaign-drafts', payload);
}

export async function updateCampaignDraft(draftKey: string, payload: CampaignDraftUpdatePayload) {
  return sendJson(`/api/campaign-drafts/${draftKey}`, 'PATCH', payload);
}
