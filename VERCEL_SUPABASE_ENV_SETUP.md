# VERCEL_SUPABASE_ENV_SETUP.md

## Goal
Prepare the deployed `athletics-ai-workforce-web` app to use the live Supabase project.

## Required Environment Variables
### Public
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-only / future use
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN`

## Recommended Immediate Steps
1. Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel project `athletics-ai-workforce-web`
2. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel project `athletics-ai-workforce-web`
3. Redeploy production
4. Validate that read/write stubs begin using Supabase instead of fallback mode
5. Apply the SQL migrations to the live Supabase project
6. Validate seeded organization/agent/task/knowledge data renders in production

## Validation Targets
- org setup form returns Supabase success message
- knowledge ingestion returns Supabase success message
- worker/service reads begin returning live rows when available

## Warning
Do not store live secrets in repo files. Keep them only in Vercel/Supabase environment configuration.
