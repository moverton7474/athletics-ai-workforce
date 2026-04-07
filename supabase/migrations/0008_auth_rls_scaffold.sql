-- 0008_auth_rls_scaffold.sql
-- Non-breaking auth/RLS foundation helpers for future tenant-safe policies.

create or replace function public.requesting_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from organization_members om
    where om.organization_id = target_org_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(target_org_id uuid, allowed_roles text[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from organization_members om
    where om.organization_id = target_org_id
      and om.user_id = auth.uid()
      and om.role = any(allowed_roles)
  );
$$;

create index if not exists idx_organization_members_org_user
  on organization_members (organization_id, user_id);

create index if not exists idx_agents_org_created_at
  on agents (organization_id, created_at desc);

create index if not exists idx_tasks_org_created_at
  on tasks (organization_id, created_at desc);

create index if not exists idx_approvals_org_created_at
  on approvals (organization_id, created_at desc);

create index if not exists idx_knowledge_items_org_created_at
  on knowledge_items (organization_id, created_at desc);

create index if not exists idx_connector_runs_org_created_at
  on connector_runs (organization_id, created_at desc);
