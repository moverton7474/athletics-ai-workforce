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
### Do not modify KSU CSOS casually
Treat KSU CSOS as an existing production-capable backend system and integrate with it carefully.

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

### Integrate through an adapter/gateway
Use a dedicated CSOS adapter/gateway so agents do not directly hold CSOS service credentials and athletics-ai-workforce does not depend on unstable CSOS frontend service contracts.

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
- keep `ROADMAP.md` current with every major direction change
- maintain implementation/handoff docs for each active build slice
- define the first stable CSOS adapter contract in `CSOS_ADAPTER_SPEC.md`

### Technical work
- continue Phase 2.3 proposal review/orchestration hardening
- map athletics-ai-workforce approval actions to CSOS adapter actions
- implement the first live CSOS-backed read path through the adapter
- define Salesforce / Paciolan / Blackbaud-ready extension points in the gateway design

### Process / memory work
- enforce `SESSION_STARTUP_PROTOCOL.md` at startup
- reduce session drift with stronger handoff + roadmap discipline

## Important Notes
- Several credentials/tokens were pasted during the session; do not preserve them in durable docs.
- User intended to rotate GitHub token after setup.
- Browser Relay / direct Marblism access was not fully completed during this session; much of the reverse-engineering was done via screenshots and observed URLs.

## Recommended First Prompt For New Session
"Read NEW_SESSION_HANDOFF.md, ROADMAP.md, PHASE_2_3_IMPLEMENTATION_PLAN.md, CSOS_ADAPTER_SPEC.md, INTEGRATION_GATEWAY_ARCHITECTURE.md, SESSION_HANDOFF_2026-04-07_LATE.md, and SESSION_STARTUP_PROTOCOL.md. Then continue athletics-ai-workforce as an approval-driven orchestration platform that integrates with KSU CSOS through a stable adapter/gateway. Prioritize roadmap fidelity, handoff continuity, and the next implementation slice."
