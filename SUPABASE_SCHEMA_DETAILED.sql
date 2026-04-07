-- SUPABASE_SCHEMA_DETAILED.sql
-- Initial schema draft for athletics-ai-workforce

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists seats (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  seat_type text not null,
  status text not null default 'active',
  assigned_user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  role_name text not null,
  mode text not null check (mode in ('shared', 'personal')),
  status text not null default 'active',
  guidelines_md text,
  created_at timestamptz not null default now()
);

create table if not exists agent_assignments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  user_id uuid,
  team_name text,
  created_at timestamptz not null default now()
);

create table if not exists agent_threads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  title text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references agent_threads(id) on delete cascade,
  sender_type text not null,
  sender_id uuid,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'queued',
  priority text not null default 'normal',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists task_status_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists workflow_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  description text,
  definition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references workflow_templates(id) on delete set null,
  organization_id uuid not null references organizations(id) on delete cascade,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  step_name text not null,
  status text not null default 'queued',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  workflow_run_id uuid references workflow_runs(id) on delete set null,
  status text not null default 'pending',
  requested_by_agent_id uuid references agents(id) on delete set null,
  approved_by_user_id uuid,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists integration_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  provider text not null,
  label text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists connector_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  connector_name text not null,
  agent_id uuid references agents(id) on delete set null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  status text not null default 'queued',
  error_text text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists memory_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  memory_type text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_type text not null,
  actor_id uuid,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists billing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  billing_period text not null default 'monthly',
  price_cents integer not null default 0,
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  billing_plan_id uuid references billing_plans(id) on delete set null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

-- CSOS bridge tables
create table if not exists csos_command_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  command text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists csos_command_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  command_template_id uuid references csos_command_templates(id) on delete set null,
  raw_command text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  status text not null default 'queued',
  error_text text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists csos_result_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists csos_entity_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  csos_entity_id text not null,
  local_entity_type text,
  local_entity_id uuid,
  created_at timestamptz not null default now()
);
