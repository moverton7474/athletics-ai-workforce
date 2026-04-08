alter table approvals
  add column if not exists connector_run_id uuid references connector_runs(id) on delete set null,
  add column if not exists title text,
  add column if not exists summary text,
  add column if not exists details jsonb not null default '{}'::jsonb,
  add column if not exists requested_by_user_id uuid;

create index if not exists idx_approvals_org_status_created_at
  on approvals (organization_id, status, created_at desc);

create index if not exists idx_approvals_connector_run_id
  on approvals (connector_run_id);
