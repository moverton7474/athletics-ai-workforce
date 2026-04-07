# ROADMAP.md

## Phase 0 - Discovery / Reverse Engineering
### Goals
- Reverse-engineer Marblism UX, collaboration model, and pricing strategy
- Review KSU CSOS read-only to identify connector and orchestration opportunities
- Define separation of concerns between CSOS and workforce platform

### Outputs
- Marblism pattern analysis
- KSU CSOS connector map
- Product architecture decision record
- Initial agent roster

---

## Phase 1 - Foundation
### Goals
Build the standalone platform skeleton.

### Workstreams
1. **Repo / Project Setup**
   - frontend app shell
   - backend/api layer
   - shared types
   - environment template
2. **Supabase Project**
   - organizations
   - members
   - seats
   - agents
   - threads
   - tasks
   - workflows
   - approvals
   - memory
   - billing tables
3. **Authentication / Roles**
   - owner
   - admin
   - operator
   - collaborator
4. **Core Agent Runtime**
   - agent definitions
   - prompts/guidelines
   - tool permissions
   - thread persistence
   - event logging

### Exit Criteria
- New org can be created
- Users can be invited
- Agents can be created and assigned as personal/shared
- Tasks can be created and logged

---

## Phase 2 - College Sports MVP
### Goals
Launch the first high-value athletics workforce.

### Initial Agents
1. Chief of Staff Agent
2. Executive Assistant Agent
3. Sponsorship Intelligence Agent
4. Proposal / Outreach Agent
5. Compliance & Coordination Agent

### Key Features
- agent roster dashboard
- chat/thread interface per agent
- tasks and approvals
- quick action templates
- department shared mode vs personal mode
- daily executive briefing

### Exit Criteria
- Sponsorship workflows can be initiated from workforce platform
- Human approvals are captured before external actions
- Agent tasks and outputs are auditable

---

## Phase 3 - CSOS Connector Integration
### Goals
Use CSOS as a backend execution engine.

### Connector Design
- CLI execution adapter first
- direct RPC adapter later
- strict service-role isolation through connector service

### Initial CSOS Operations to Support
- sponsor attrition
- alumni crossref / decision-maker matching
- proposal create
- reporting

### Exit Criteria
- Workforce agents can trigger CSOS operations through connector service
- Structured JSON results flow back into task/workflow engine
- All runs are logged with input/output metadata

---

## Phase 4 - Productization
### Goals
Turn the system into a sellable product.

### Packaging
- Core Workforce plan
- Sponsorship Pack
- Recruiting Pack
- NIL Pack
- Content Pack
- Compliance Pack
- Org/team seats

### Billing Model
- base platform subscription
- add-on agent packs
- collaborator seats
- enterprise/custom workflow tier

### Exit Criteria
- Pricing page and entitlement model implemented
- Plans map directly to enabled agents/features
- Trial/demo org flow exists

---

## Phase 5 - Generalize Beyond Athletics
### Goals
Abstract the framework for other industries.

### Approach
- keep workforce core generic
- domain packs become pluggable
- connector architecture supports additional vertical tools

### Candidate Verticals
- healthcare operations
- legal support ops
- recruiting/staffing
- agency operations
- local business growth ops

---

## Guiding Principles
- Do not disturb working CSOS operations
- Use CSOS as a connector, not a codebase to rewrite
- Keep secrets isolated in connector services, not broad agent access
- Favor structured outputs and auditability over opaque autonomy
- Human approval gates for sensitive or external actions
