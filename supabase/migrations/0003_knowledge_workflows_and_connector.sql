-- 0003_knowledge_workflows_and_connector.sql

create table if not exists knowledge_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  worker_id uuid references agents(id) on delete set null,
  scope text not null default 'organization',
  source_type text not null,
  title text,
  content text,
  source_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  step_name text not null,
  status text not null default 'queued',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists csos_command_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  command text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table approvals
  add column if not exists decision_note text,
  add column if not exists approval_type text not null default 'standard';
