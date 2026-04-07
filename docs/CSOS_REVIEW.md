# CSOS_REVIEW.md

## Summary
KSU CSOS is an AI-native CLI that exposes athletics operations as composable commands suitable for autonomous agent execution.

## Evidence Observed
- README explicitly states: "Make any AI agent operate KSU Athletics like a staff member."
- CLI groups: constituent, alumni, sponsor, campaign, outreach, proposal, report
- Planned groups: goal, ambassador
- All commands support `--json` for machine-readable chaining
- Config uses `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Data layer uses direct PostgREST table queries and RPC calls through a lightweight client

## Architectural Interpretation
CSOS is:
- a domain execution layer
- a structured command surface for athletics workflows
- a strong backend tool for autonomous agents

CSOS is not yet:
- a workforce orchestration platform
- a seat/collaboration management system
- a broad agent memory/approval platform
- a multi-tenant product layer

## Why This Matters
The new workforce platform should leverage CSOS for athletics-specific execution rather than cloning its domain logic.

## Best Integration Pattern
### Phase 1
Use a CLI connector:
- execute CSOS commands
- parse JSON outputs
- log command inputs/outputs in workforce platform

### Phase 2
Add direct Supabase RPC adapters where performance or product needs justify it.

## Sponsorship Command Insights
The sponsor command group already supports workflows highly valuable to external agents:
- attrition analysis
- alumni matching
- pipeline creation
- pipeline advancement
- category gap prioritization

## Proposal Command Insights
The proposal command group supports:
- proposal creation
- sponsorship asset management
- approval status states
- proposal detail rendering

This makes CSOS especially strong for a first external workforce focused on sponsorship revenue operations.
