-- 0012_memory_entry_policy_hardening.sql
-- Tighten tenant-safe access around memory entries while preserving the current
-- service-role-backed server write path.

create index if not exists idx_memory_entries_org_created_at
  on memory_entries (organization_id, created_at desc);

create index if not exists idx_memory_entries_org_agent_created_at
  on memory_entries (organization_id, agent_id, created_at desc);

drop policy if exists memory_entries_member_select on memory_entries;
create policy memory_entries_member_select on memory_entries
for select using (public.is_org_member(organization_id));

drop policy if exists memory_entries_privileged_insert on memory_entries;
create policy memory_entries_privileged_insert on memory_entries
for insert with check (
  public.has_org_role(organization_id, array['owner', 'admin', 'operator'])
  and (
    agent_id is null
    or exists (
      select 1
      from agents a
      where a.id = memory_entries.agent_id
        and a.organization_id = memory_entries.organization_id
    )
  )
);

drop policy if exists memory_entries_privileged_update on memory_entries;
create policy memory_entries_privileged_update on memory_entries
for update using (
  public.has_org_role(organization_id, array['owner', 'admin', 'operator'])
)
with check (
  public.has_org_role(organization_id, array['owner', 'admin', 'operator'])
  and (
    agent_id is null
    or exists (
      select 1
      from agents a
      where a.id = memory_entries.agent_id
        and a.organization_id = memory_entries.organization_id
    )
  )
);

drop policy if exists memory_entries_privileged_delete on memory_entries;
create policy memory_entries_privileged_delete on memory_entries
for delete using (
  public.has_org_role(organization_id, array['owner', 'admin', 'operator'])
);
