# SUPABASE_SETUP.md

## Project
- Project name: athletics-ai-workforce
- Recommended environment separation:
  - local dev
  - staging
  - production

## Goals
- use Supabase as the system of record for organizations, agents, tasks, workflows, approvals, and billing primitives
- keep live secrets out of git
- use service-role credentials only in backend/connector contexts

## Setup Steps
### 1. Install/login Supabase CLI
```bash
supabase login
supabase --version
```

### 2. Link local repo to remote project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Pull remote metadata if needed
```bash
supabase db pull
```

### 4. Apply initial schema locally / remotely
```bash
supabase db reset
supabase db push
```

## Environment Variables
Use backend-only secrets for:
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_ACCESS_TOKEN
- database password

Use public-safe env vars for frontend only:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Security Guidance
- never expose service-role keys to frontend
- connector runtime should hold CSOS and privileged Supabase access
- rotate credentials after major setup if they were pasted/shared in chat

## First Tables To Validate
- organizations
- organization_members
- seats
- agents
- agent_threads
- agent_messages
- tasks
- approvals
- workflow_templates
- workflow_runs
- connector_runs
- memory_entries

## Success Criteria
- repo linked to project
- migration runs cleanly
- auth enabled
- frontend can read public-safe tables through policies later
- backend can operate connector/admin tasks safely
