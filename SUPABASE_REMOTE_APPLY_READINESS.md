# SUPABASE_REMOTE_APPLY_READINESS.md

## Status
Readiness is **mostly good**, with one major caveat already identified and partially mitigated in app code.

## Verified findings
- Supabase CLI is available in this environment: `2.87.2`
- migration directory exists and is ordered correctly:
  1. `0001_initial_schema.sql`
  2. `0002_org_profile_and_visibility.sql`
  3. `0003_knowledge_workflows_and_connector.sql`
  4. `0004_rls_policies.sql`
  5. `0005_seed_workers.sql`
  6. `0006_demo_org_seed.sql`
- `0001_initial_schema.sql` enables `pgcrypto`, so `gen_random_uuid()` support is covered.
- `0006_demo_org_seed.sql` correctly depends on structures added in `0002` and `0003`.

## Important caveat
### RLS behavior
`0004_rls_policies.sql` enables RLS on key tables and creates only placeholder **select** policies. It does **not** create insert/update policies for anon/browser writes.

That means:
- direct browser writes with the public anon key are likely to fail once the remote project is using these RLS rules
- server-side writes using `SUPABASE_SERVICE_ROLE_KEY` are the cleaner path for current production validation

## Readiness verdict by area
### Safe to push remotely now
- schema creation
- organization profile fields
- knowledge items table creation
- seeded demo org / agents / tasks / knowledge row

### Ready but should be validated right after push
- read surfaces for organizations, agents, tasks, approvals, knowledge, connector runs
- demo seed visibility

### Not truly production-safe until next auth/RLS pass
- end-user scoped writes through browser anon access
- hardened policy model by organization membership

## Recommended remote apply order
1. configure Vercel env vars
2. set `SUPABASE_SERVICE_ROLE_KEY` in Vercel
3. run `supabase link --project-ref <project-ref>`
4. run `supabase migration list`
5. run `supabase db push`
6. confirm seeded rows exist
7. test the deployed UI with Playwright
8. manually validate Org Setup and Knowledge writes

## Immediate blocker summary
- remote values are still needed for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_PROJECT_ID`
  - `SUPABASE_ACCESS_TOKEN`

## Recommendation
Use the new server-side write route path for production validation now, then do a dedicated auth/RLS hardening pass before treating writes as multi-tenant-safe.
