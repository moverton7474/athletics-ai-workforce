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

async function postJson(path: string, payload: unknown) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function saveOrgProfile(payload: OrgProfilePayload) {
  return postJson('/api/org-profile', payload);
}

export async function addKnowledgeItem(payload: KnowledgePayload) {
  return postJson('/api/knowledge-items', payload);
}
