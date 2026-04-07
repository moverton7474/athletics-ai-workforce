# PRODUCTION_WRITE_PATH_NOTES.md

## What changed
Org Setup and Knowledge writes should use server-side API routes instead of calling Supabase directly from browser code.

### New route targets
- `POST /api/org-profile`
- `POST /api/knowledge-items`

## Why this is better
- keeps the write contract stable if RLS tightens
- allows use of `SUPABASE_SERVICE_ROLE_KEY` on the server when available
- keeps validation logic in one place
- provides clearer success/failure messages for production validation

## Current behavior by env state
### If `SUPABASE_SERVICE_ROLE_KEY` is present
- writes use server-side service-role path
- best current mode for production validation

### If only public Supabase env vars are present
- writes use a server route but still fall back to anon-key access
- may still hit RLS limits depending on remote policy state

### If no Supabase env vars are present
- writes validate payloads and return a stub message
- no persistence occurs

## Next upgrade after this
- replace demo-org write assumptions with authenticated org-scoped writes
- add audit/event log entries for these writes
- add Playwright safe submit tests against preview or test data
