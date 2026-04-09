create table if not exists segment_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  segment_key text not null unique,
  label text not null,
  source_type text not null default 'saved_segment',
  summary text,
  rationale text,
  audience_count integer,
  estimated_value numeric,
  filter_definition jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_segment_definitions_org_id on segment_definitions (organization_id);
create index if not exists idx_segment_definitions_source_type on segment_definitions (source_type);

create table if not exists campaign_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  draft_key text not null unique,
  campaign_key text,
  segment_key text,
  title text not null,
  objective text,
  status text not null default 'draft',
  selected_channels jsonb not null default '[]'::jsonb,
  assets jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaign_drafts_org_id on campaign_drafts (organization_id);
create index if not exists idx_campaign_drafts_segment_key on campaign_drafts (segment_key);
create index if not exists idx_campaign_drafts_campaign_key on campaign_drafts (campaign_key);
