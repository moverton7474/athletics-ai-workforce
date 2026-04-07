# RLS_PLAN.md

## Goal
Define row-level security strategy for Supabase-backed multi-tenant access.

## Principles
- tenant isolation first
- frontend only gets least-privilege access
- service-role usage stays backend-only
- shared vs personal visibility enforced at data layer where possible

## Table access strategy
### organizations
- members can read their org
- only owners/admins can update org profile fields

### organization_members
- members can read membership in their org
- only owners/admins can invite/manage roles

### agents
- org members can read shared agents in their org
- users can read their own personal agents
- only owners/admins/operators can create/update agents depending on role

### agent_threads / agent_messages
- shared worker threads visible to org members with access
- personal worker threads visible only to assigned user + privileged admins

### tasks / approvals / workflow_runs
- visible by org role + assignment scope
- approval actions limited to authorized approvers

### memory_entries
- org-scoped memories visible based on scope field
- personal memories private by default

## Implementation plan
1. add `organization_id` to all tenant-scoped tables
2. add `visibility_scope` / assignment fields where needed
3. define helper SQL functions for membership checks
4. write policies table by table
5. test with owner/admin/operator/collaborator roles

## Note
RLS should follow schema stabilization, not precede it.
