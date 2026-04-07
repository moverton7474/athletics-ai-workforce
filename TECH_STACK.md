# TECH_STACK.md

## Recommended Stack
### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- component library to be chosen later (shadcn/ui recommended)

### Backend / API
- Next.js server routes or separate Node service
- TypeScript
- Supabase client libraries

### Database / Platform
- Supabase Postgres
- Supabase Auth
- Supabase Storage (optional for generated files/docs)
- Supabase Edge Functions as needed later

### Orchestration / Workers
- server-side workflow runner
- task queue abstraction
- connector execution service

### Integrations
- CSOS CLI connector
- email connector
- calendar connector
- messaging connectors later

## Why this stack
- fast to ship
- clean Supabase integration
- strong TypeScript ecosystem
- easy to productize across industries

## Guardrails
- do not commit live secrets
- isolate service-role credentials in backend-only environment variables
- keep connector permissions narrow and auditable
