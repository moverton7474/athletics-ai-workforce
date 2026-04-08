alter table approvals
  add column if not exists requested_action text,
  add column if not exists target_system text,
  add column if not exists entity_type text,
  add column if not exists entity_name text,
  add column if not exists stage text,
  add column if not exists next_action_label text,
  add column if not exists outcome_task_id uuid references tasks(id) on delete set null;

create index if not exists idx_approvals_org_requested_action_status
  on approvals (organization_id, requested_action, status, created_at desc);

create index if not exists idx_approvals_org_entity_name
  on approvals (organization_id, entity_name);
