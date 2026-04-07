# NEW_SESSION_HANDOFF.md

## Purpose
Use this file to quickly bootstrap the next session with full context on the `athletics-ai-workforce` project.

## Project Summary
`athletics-ai-workforce` is a Marblism-style AI workforce platform being designed first for college athletics, with KSU CSOS as a read-only reference and domain execution backend.

### Core strategic split
- **KSU CSOS** = domain execution / athletics operations backend
- **athletics-ai-workforce** = orchestration, collaboration, memory, task routing, approvals, productization

## Current Status
### Repo
GitHub repo exists and is synced:
- `https://github.com/moverton7474/athletics-ai-workforce`

### Docs already created
- `README.md`
- `ROADMAP.md`
- `PRODUCT_REQUIREMENTS.md`
- `AGENT_SPECS.md`
- `CSOS_CONNECTOR_SPEC.md`
- `PRICING_AND_PACKAGING.md`
- `SUPABASE_SCHEMA_DETAILED.sql`
- `docs/ARCHITECTURE.md`
- `docs/SESSION_HANDOFF.md`
- `docs/CSOS_REVIEW.md`
- `docs/WORKFORCE_BLUEPRINT.md`
- `supabase/SCHEMA_OVERVIEW.md`
- `backups/session-summary-2026-04-06.md`

## Major Findings So Far
### Marblism patterns identified
- named AI employees
- persistent per-agent threads
- Chat / Posts / Guidelines structure
- quick-action prompts
- personal/private vs shared/team agent model
- base platform + add-ons + collaborator seats monetization

### KSU CSOS patterns identified
- AI-native CLI with structured command groups
- designed for agents to execute athletics work as staff members
- supports machine-readable `--json` outputs
- uses Supabase/PostgREST + RPC through a thin Python wrapper
- strong sponsorship/proposal workflows already exist

## Architectural Direction
### Do not modify KSU CSOS
Treat KSU CSOS as read-only.

### Build a separate platform
The new platform should own:
- organizations
- members / seats
- shared vs personal agents
- tasks
- workflows
- memory
- approvals
- audit logs
- billing / packaging

### Integrate through a connector
Use a dedicated CSOS connector service so agents do not directly hold CSOS service credentials.

## MVP Agent Set
1. Chief of Staff Agent
2. Executive Assistant Agent
3. Sponsorship Intelligence Agent
4. Proposal & Outreach Agent
5. Compliance & Coordination Agent

## Why these first
Because the current CSOS command surface already strongly supports:
- sponsor attrition
- alumni matching
- proposal creation
- pipeline progression
- reporting

## Immediate Next Work
### Product / design docs
- create a dedicated Marblism reverse-engineering document
- create a workflow catalog doc for athletics use cases
- create UI/UX specification for shared vs personal agents
- create implementation plan for frontend/backend stack

### Technical work
- define detailed Supabase migrations from schema draft
- define CSOS connector interfaces and run logging
- define first workflow templates
- define approval state machine

### Research work
- continue direct Marblism recon if Browser Relay becomes available
- inspect more CSOS command files (`alumni`, `outreach`, `report`, possibly `campaign`)

## Important Notes
- Several credentials/tokens were pasted during the session; do not preserve them in durable docs.
- User intended to rotate GitHub token after setup.
- Browser Relay / direct Marblism access was not fully completed during this session; much of the reverse-engineering was done via screenshots and observed URLs.

## Recommended First Prompt For New Session
"Read NEW_SESSION_HANDOFF.md, ROADMAP.md, PRODUCT_REQUIREMENTS.md, AGENT_SPECS.md, CSOS_CONNECTOR_SPEC.md, PRICING_AND_PACKAGING.md, docs/ARCHITECTURE.md, docs/CSOS_REVIEW.md, and docs/WORKFORCE_BLUEPRINT.md. Then continue designing athletics-ai-workforce as a Marblism-style external AI workforce platform that integrates with KSU CSOS without modifying it. Prioritize detailed Supabase migrations, connector design, workflow catalog, and the next implementation docs."
