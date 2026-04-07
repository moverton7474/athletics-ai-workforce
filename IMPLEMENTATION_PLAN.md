# IMPLEMENTATION_PLAN.md

## Execution Mode
Proceed in controlled phases. Do not modify KSU CSOS. Build `athletics-ai-workforce` as a separate platform that integrates with CSOS through connectors.

## Phase 1 - Platform Foundation
### Deliverables
- auth + organization model
- seat model
- agent registry
- thread/message model
- task queue
- approvals
- memory and activity logging
- billing primitives

### Technical outputs
- Supabase migrations v1
- environment template
- frontend app shell
- backend/api shell
- shared types package

## Phase 2 - CSOS Connector
### Deliverables
- connector interface
- CLI execution adapter for CSOS commands
- run logging
- JSON normalization layer
- permission boundaries for connector actions

## Phase 3 - College Athletics MVP
### Initial workflows
- sponsor attrition recovery
- alumni sponsor matching
- proposal creation and handoff
- executive summary generation
- compliance coordination reminders

### Initial agents
- Chief of Staff
- Executive Assistant
- Sponsorship Intelligence
- Proposal & Outreach
- Compliance & Coordination

## Phase 4 - Productization
### Deliverables
- plan/seat entitlements
- add-on packs
- onboarding flows
- shared/personal agent UX
- admin dashboard

## Immediate Next Build Tasks
1. lock stack decision
2. finalize migration v1
3. create env template
4. scaffold frontend/backend folders
5. define connector interface
6. define first workflow templates
