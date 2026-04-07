# APP_MVP_TASKLIST.md

## Build Sequencing

### Track A - Platform Core
- [ ] finalize stack and package manager
- [ ] scaffold Next.js app
- [ ] scaffold backend/api layer
- [ ] create shared type package
- [ ] wire env loading safely

### Track B - Supabase
- [ ] link project with Supabase CLI
- [ ] validate `0001_initial_schema.sql`
- [ ] create row-level security plan
- [ ] create auth strategy for org users
- [ ] add storage strategy for generated artifacts later

### Track C - Agent Runtime
- [ ] create agent registry model
- [ ] create personal/shared agent assignment logic
- [ ] create thread/message persistence
- [ ] create task creation and routing logic
- [ ] create approval model and states

### Track D - CSOS Connector
- [ ] define command templates
- [ ] implement CLI execution adapter
- [ ] capture raw stdout/stderr
- [ ] parse JSON outputs
- [ ] store connector run logs

### Track E - MVP Workflows
- [ ] sponsor attrition recovery
- [ ] alumni sponsor matching
- [ ] proposal draft workflow
- [ ] executive briefing workflow
- [ ] compliance coordination workflow

### Track F - Product UX
- [ ] org creation flow
- [ ] invite member flow
- [ ] agent roster dashboard
- [ ] task inbox
- [ ] approval center
- [ ] billing placeholder screens

### Track G - Hardening
- [ ] audit logs
- [ ] permissions review
- [ ] error handling
- [ ] retry behavior
- [ ] usage analytics basics
