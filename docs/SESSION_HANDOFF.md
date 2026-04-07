# SESSION_HANDOFF.md

## Project
athletics-ai-workforce

## Objective
Build a Marblism-style AI workforce platform for college sports that can:
1. operate independently as a product,
2. collaborate with the KSU CSOS system,
3. support agent-to-agent collaboration and human approvals,
4. later generalize to other industries.

## What We Learned
### Marblism patterns identified
- named AI employees by role
- persistent per-agent chat threads
- Chat / Posts / Guidelines pattern
- suggested quick actions
- team/shared vs personal/private agent modes
- base subscription + add-ons + collaborator seats pricing model

### KSU CSOS findings
- Python CLI designed to let AI agents operate athletics workflows
- Supabase/PostgREST-backed
- thin config/client wrapper
- command groups include constituent, alumni, sponsor, campaign, outreach, proposal, report
- sponsorship commands include attrition analysis, alumni matching, pipeline add/advance, category gaps
- proposal commands include creation, asset management, approval-oriented status flow

## Strategic Architecture Decision
Do not rebuild CSOS.
Use CSOS as a connector/execution backend for athletics-specific workflows.
Build the new platform as the workforce orchestration and commercialization layer.

## Recommended First Agents
1. Chief of Staff Agent
2. Executive Assistant Agent
3. Sponsorship Intelligence Agent
4. Proposal / Outreach Agent
5. Compliance & Coordination Agent

## Repo Deliverables Created
- README.md
- ROADMAP.md
- docs/ARCHITECTURE.md
- docs/SESSION_HANDOFF.md
- docs/CSOS_REVIEW.md
- docs/WORKFORCE_BLUEPRINT.md
- supabase/SCHEMA_OVERVIEW.md
- backups/session-summary-2026-04-06.md

## Remaining Work
- inspect more CSOS command files (alumni/outreach/report)
- inspect Marblism directly via Browser Relay when available
- define Supabase schema in more detail
- define first five agents more concretely
- create product packaging/pricing docs
- scaffold application code and initial UI

## Important Constraints
- KSU CSOS codebase is read-only reference for this effort
- secrets should not be stored in durable docs
- connector services should hold sensitive keys, not broad agent access
