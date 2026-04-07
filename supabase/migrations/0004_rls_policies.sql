-- 0004_rls_policies.sql
-- Draft RLS/policy scaffolding. Refine after auth model is fully wired.

alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table agents enable row level security;
alter table agent_threads enable row level security;
alter table agent_messages enable row level security;
alter table tasks enable row level security;
alter table approvals enable row level security;
alter table workflow_runs enable row level security;
alter table memory_entries enable row level security;
alter table connector_runs enable row level security;
alter table knowledge_items enable row level security;

-- Placeholder policies for later refinement.
-- Real policies should use auth.uid() and membership checks.

drop policy if exists org_read_placeholder on organizations;
create policy org_read_placeholder on organizations
for select using (true);

drop policy if exists member_read_placeholder on organization_members;
create policy member_read_placeholder on organization_members
for select using (true);
