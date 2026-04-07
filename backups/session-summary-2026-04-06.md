# Session Summary Backup - 2026-04-06

## User Goal
Create a Marblism-like AI workforce platform for college sports that collaborates with the KSU CSOS system and can later stand alone as a product for other industries.

## Key Decisions
- New repo name: athletics-ai-workforce
- KSU CSOS remains read-only and should not be modified for this effort
- CSOS should be treated as an execution backend / connector for athletics-specific workflows
- New platform will own orchestration, tasks, memory, collaboration, approvals, and product packaging

## Marblism Insights Gathered
- named AI employees
- persistent threads
- Chat / Posts / Guidelines pattern
- quick action prompts
- team/shared vs personal/private agents
- collaborator seat model and add-ons

## KSU CSOS Insights Gathered
- Python CLI with Click command groups
- Supabase REST and RPC backend
- machine-readable `--json` output for chaining
- strong sponsorship and proposal workflow support

## Repo Files Created
- README.md
- ROADMAP.md
- docs/ARCHITECTURE.md
- docs/SESSION_HANDOFF.md
- docs/CSOS_REVIEW.md
- docs/WORKFORCE_BLUEPRINT.md
- supabase/SCHEMA_OVERVIEW.md

## Next Steps
- push repo to GitHub when access is available
- continue reading additional CSOS command files
- inspect Marblism directly via Browser Relay when attached
- build detailed Supabase schema and first five agent specs
