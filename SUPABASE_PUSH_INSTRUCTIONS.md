# SUPABASE_PUSH_INSTRUCTIONS.md

## Purpose
Reference steps for applying local migrations to the linked Supabase project.

## Suggested flow
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## If pulling first is needed
```bash
supabase db pull
```

## If testing locally first
```bash
supabase start
supabase db reset
```

## Migration order currently expected
1. `0001_initial_schema.sql`
2. `0002_org_profile_and_visibility.sql`
3. `0003_knowledge_workflows_and_connector.sql`
4. `0004_rls_policies.sql`
5. `0005_billing_and_subscription_tables.sql`
6. `0006_seed_workers.sql`
7. `0007_demo_org_seed.sql`

## Notes
- Apply migrations from the repo root
- Keep service-role secrets out of the repo
- Validate auth/RLS behavior after policy migration
