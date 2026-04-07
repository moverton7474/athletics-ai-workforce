# VERCEL_SETUP.md

## Purpose
Prepare athletics-ai-workforce for Vercel deployment when the app shell is ready.

## Expected projects
- web frontend on Vercel
- api can remain inside Next.js routes initially or split later

## Required environment variables
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_PROJECT_ID
- SUPABASE_ACCESS_TOKEN

## Deployment notes
- keep service-role keys server-only
- do not expose connector secrets to client bundles
- configure preview and production environments separately

## Suggested first deployment flow
1. import GitHub repo into Vercel
2. attach environment variables
3. deploy preview
4. validate auth and basic routes
5. deploy production after policy/data checks
