-- 0009_membership_binding_and_select_policies.sql

create unique index if not exists idx_organization_members_unique_org_user
  on organization_members (organization_id, user_id);

alter table organization_members
  drop constraint if exists organization_members_role_check;

alter table organization_members
  add constraint organization_members_role_check
  check (role in ('owner', 'admin', 'operator', 'collaborator'));

drop policy if exists org_read_placeholder on organizations;
create policy organizations_member_select on organizations
for select using (public.is_org_member(id));

create policy organizations_owner_admin_update on organizations
for update using (public.has_org_role(id, array['owner', 'admin']))
with check (public.has_org_role(id, array['owner', 'admin']));

drop policy if exists member_read_placeholder on organization_members;
create policy organization_members_member_select on organization_members
for select using (public.is_org_member(organization_id));

create policy agents_member_select on agents
for select using (public.is_org_member(organization_id));

create policy tasks_member_select on tasks
for select using (public.is_org_member(organization_id));

create policy approvals_member_select on approvals
for select using (public.is_org_member(organization_id));

create policy knowledge_items_member_select on knowledge_items
for select using (public.is_org_member(organization_id));

create policy connector_runs_member_select on connector_runs
for select using (public.is_org_member(organization_id));
