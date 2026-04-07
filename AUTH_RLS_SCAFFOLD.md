# AUTH_RLS_SCAFFOLD.md

## Purpose
Lay down a non-breaking scaffold for proper Supabase auth + tenant-safe RLS without interrupting the currently live demo environment.

## What is included now
- helper SQL functions:
  - `requesting_user_id()`
  - `is_org_member(target_org_id)`
  - `has_org_role(target_org_id, allowed_roles)`
- query-supporting indexes for tenant-scoped tables
- documentation of the next policy pass

## What is intentionally not changed yet
- the current placeholder read policies are not removed in this scaffold pass
- no restrictive auth-only policies are activated yet
- unauthenticated demo access is preserved for the current product-validation stage

## Next auth/RLS pass
1. wire Supabase Auth users into `organization_members.user_id`
2. backfill owner/admin/operator/collaborator role semantics
3. replace placeholder select policies with membership policies
4. add insert/update/delete policies per table
5. test owner/admin/operator/collaborator access paths
6. update Playwright to validate authenticated tenant behavior

## Rationale
The live app just moved from mock/demo persistence to real Supabase-backed production validation. This scaffold prepares the database for the true auth/RLS cutover without breaking the currently working demo deployment.
