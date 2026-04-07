# NORTH_STAR_ARCHITECTURE.md

## Source Influence
This document synthesizes the uploaded agentic staffing platform diagrams and notes.

## Strategic Positioning
athletics-ai-workforce should be built in two layers:

### Layer A - Athletics MVP (near-term)
- shared/personal workers
- tasks
- approvals
- memory
- CSOS connector
- sponsorship/proposal workflows

### Layer B - Staffing infrastructure platform (long-term)
- role recommendation engine
- agent compiler / versioned config bundles
- tool gateway with policy engine
- observability/replay/evals
- billing + metering
- deployment targets beyond hosted portal

## North-Star Architecture
### Intake / Matching Layer
- org/user intake
- workflow/role discovery
- role recommendation logic
- onboarding and plan packaging

### Agent Config Layer
- role templates
- org profile
- worker guidelines
- policy constraints
- versioned agent config bundles

### Agent Runtime Layer
- conversation engine
- orchestration
- memory
- task execution
- evals

### Tool / Policy Layer
- approvals
- RBAC
- secrets isolation
- connector policy enforcement
- audit logs

### Data Layer
- Postgres / Supabase
- object storage
- vector/search memory later
- event log / metering records

### Observability Layer
- traces
- replay
- QA mode
- audit exports
- metrics

### Billing Layer
- role base fee
- pack/capability add-ons
- usage metering
- invoicing/tax later

### Deployment Targets
- hosted web portal
- embedded experiences
- browser extension assisted workflows
- voice/call channels later

## Athletics-Specific Adaptation
The athletics version should use this north-star architecture, but keep the MVP constrained.
Do not front-load all enterprise/voice complexity into v1.

## MVP Principle
Build toward the north star without trying to ship the whole staffing infrastructure at once.
