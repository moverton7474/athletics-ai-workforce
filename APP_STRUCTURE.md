# APP_STRUCTURE.md

## Proposed Repo Layout

```text
athletics-ai-workforce/
  apps/
    web/                # Next.js frontend
    api/                # backend/api/orchestrator service
  packages/
    shared/             # shared types, schemas, utilities
  docs/
  supabase/
    migrations/
  backups/
```

## apps/web responsibilities
- auth screens
- org dashboard
- agent roster
- thread/chat UI
- task inbox
- approval center
- billing/plan screens

## apps/api responsibilities
- server-side orchestration
- connector execution
- CSOS adapter
- approval enforcement
- workflow engine
- audit logging

## packages/shared responsibilities
- type definitions
- DTOs
- validation schemas
- shared constants

## supabase responsibilities
- schema migrations
- auth/storage settings references
