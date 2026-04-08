# ROADMAP.md

## Strategic Direction
Build `athletics-ai-workforce` as a Marblism-style AI workforce platform with stronger enterprise governance, a clearer execution backend strategy, and a voice-first path aligned to Milton's Three Pillars architecture.

### Core split
- **KSU CSOS** = athletics domain execution layer / connector target
- **athletics-ai-workforce** = orchestration, onboarding, shared knowledge, worker workspaces, approvals, billing, and productization
- **Voice layer** = command routing and interaction layer that should operate across the workforce without replacing manual navigation

### Inputs now shaping the roadmap
- Marblism onboarding and worker UX
- Marblism pricing / conversion / support patterns
- uploaded agentic staffing platform package
- KSU CSOS command surface and connector potential
- Batman's Three Pillars / voice-first integration recommendations

---

## Phase 0 - Discovery / Reverse Engineering
### Goals
- Reverse-engineer Marblism onboarding, worker workspace, pricing, and knowledge patterns
- Review KSU CSOS read-only to identify connector and orchestration opportunities
- Synthesize the staffing-platform north-star architecture

### Outputs
- Marblism reverse-engineering docs
- KSU CSOS connector map
- architecture decision records
- initial workforce blueprint
- north-star architecture synthesis

### Status
Substantially complete.

---

## Phase 1 - Foundation
### Goals
Build the standalone platform skeleton and keep the architecture ready for voice-first interaction.

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
   - org profile
   - agents
   - threads/messages
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
   - future security/compliance role
4. **Core Agent Runtime**
   - agent definitions
   - structured guidelines model
   - tool permissions
   - thread persistence
   - event logging
5. **Knowledge Foundation**
   - org brain / knowledge ingestion model
   - worker-level knowledge
   - personal knowledge

### Exit Criteria
- New org can be created
- Users can be invited
- Agents can be created and assigned as personal/shared
- Knowledge objects can be stored and scoped
- Tasks can be created and logged
- Core data structures can support future voice command routing without redesign

---

## Current Live State (2026-04-08)
### Confirmed now live
- Supabase-backed production deployment is active on `athletics-ai-workforce-web`
- safe server-side writes are live for org profile + knowledge items
- live reads are active on dashboard/workers/tasks/approvals/knowledge via server-side query path
- Playwright post-deploy suite is live and expanded through authenticated connector coverage
- Supabase auth scaffold exists with login page, callback route, middleware session refresh, and membership-aware shell state
- demo membership bootstrap path exists for signed-in users
- role-aware navigation and privileged action gating are active
- connector API paths now exist for sponsor attrition, sponsor category gaps, sponsor match-alumni, proposal create, proposal view, proposal submit, and reporting
- connector run history is visible in the product through `Connector Runs`
- proposal review workflow now has structured approval metadata, approval decision endpoints, dashboard approval visibility, and a dedicated approval review page
- CSOS production repo (`GF-Accelerate/ksu-csos`) has now been reviewed directly and will guide the next integration phase

### Immediate next build target
Move from authenticated connector stubs into an adapter-driven CSOS integration model while continuing to harden proposal review orchestration.

## Phase 1.5 - Voice Command Foundation
### Goals
Introduce a voice-command abstraction layer early so the product can become voice-first without delaying the MVP.

### Workstreams
- voice command routing model
- command-to-action mapping for each initial worker
- parity principle: every important UI action should have a voice path
- state continuity between manual and voice interactions
- coordination with Batman MO / existing voice infrastructure patterns

### Initial Voice Targets
- sponsor attrition analysis
- alumni matching requests
- proposal creation requests
- executive briefings
- approvals review

### Exit Criteria
- command model defined for all five MVP workers
- first CSOS workflows mapped to voice triggers
- voice/manual interaction model documented

---

## Phase 2 - Athletics MVP Product Experience
### Goals
Launch the first high-value athletics workforce with product-grade onboarding and worker UX.

### Initial Agents
1. Chief of Staff Agent
2. Executive Assistant Agent
3. Sponsorship Intelligence Agent
4. Proposal / Outreach Agent
5. Compliance & Coordination Agent

### Key Features
- AI team generation / recommendation flow
- role-by-role onboarding promise screens
- org profile capture
- agent roster dashboard
- worker tabs (chat / outputs / guidelines / settings)
- shared vs personal worker modes
- tasks and approvals
- daily executive briefing
- knowledge brain

### Exit Criteria
- A user can go from intake to generated team and active workspace
- Sponsorship workflows can be initiated from workforce platform
- Human approvals are captured before external actions
- Agent tasks and outputs are auditable

---

## Phase 2.2 - Authenticated Tenant + First Connector Action Loop
### Goals
Bridge the platform from validated demo behavior into authenticated, membership-aware operations with the first real connector-backed workflow.

### Workstreams
- bind Supabase Auth users into `organization_members`
- implement role-aware organization membership flows
- replace placeholder read policies with membership-based policies
- add authenticated Playwright coverage for sign-in + org claim + connector execution
- ship first connector API route for sponsor attrition analysis
- create first connector run → task loop for review and follow-up

### Exit Criteria
- signed-in user can claim or join an organization
- tenant-aware policies govern reads for core org-scoped tables
- a connector action can be triggered by an authenticated user
- connector runs are logged and produce follow-up task records
- authenticated Playwright coverage validates the loop end-to-end

## Phase 2.3 - Proposal Review + Workflow Orchestration
### Goals
Turn connector outputs into governed, reviewable operating workflows instead of isolated actions.

### Workstreams
- convert proposal-create outputs into structured approval requests
- connect connector runs to approvals and next-action tasks
- add role-aware action approval/reject flows
- surface latest connector outcomes + approvals + queued work on the dashboard
- expand authenticated Playwright coverage for multi-action orchestration
- persist richer approval workflow metadata and downstream outcome task state
- improve approval review UX and workflow state visibility

### Exit Criteria
- proposal-create generates a reviewable approval object
- connector actions can feed an approval queue
- dashboard shows actionable next steps instead of only raw records
- privileged users can approve/reject proposal-stage actions
- approval detail/review surface exists with structured metadata
- authenticated Playwright validates connector → approval → task flow

## Phase 3 - CSOS Adapter / Integration Gateway
### Goals
Use CSOS as the athletics backend execution engine through a stable adapter/gateway contract rather than brittle direct coupling.

### Integration Design
- adapter/gateway first
- server-side auth and payload normalization
- direct reads from vetted stable CSOS tables where appropriate
- narrow invocation of vetted CSOS Edge Functions for workflow mutations
- strict service-role isolation through connector service
- normalized run logs, audit metadata, and result objects

### Initial CSOS Operations to Support
- sponsorship pipeline reads
- sponsor attrition / category / match workflows as normalized workforce actions
- proposal generate / approve / send
- dashboard/reporting reads
- Salesforce sync visibility and controlled execution

### Exit Criteria
- Workforce agents can trigger CSOS-backed operations through a stable adapter contract
- Structured normalized results flow back into the task/workflow engine
- All runs are logged with input/output/audit metadata
- approvals can gate sensitive connector actions
- athletics-ai-workforce is not directly dependent on unstable CSOS frontend service contracts

---

## Phase 4 - Conversion, Billing, and Customer Onboarding
### Goals
Turn the platform into a sellable product with strong activation.

### Packaging
- Core Workforce plan
- Sponsorship Pack
- Recruiting Pack
- NIL Pack
- Content Pack
- Compliance Pack
- Org/team seats

### Conversion / onboarding features
- team-ready pricing page
- hosted checkout
- welcome email
- optional live setup session
- onboarding checklist

### Billing Model
- base platform subscription
- add-on agent packs
- collaborator seats
- enterprise/custom workflow tier
- future usage metering

### Exit Criteria
- Pricing page and entitlement model implemented
- Plans map directly to enabled agents/features
- Trial/demo org flow exists
- Customer can buy and activate without manual engineering support

---

## Phase 5 - Enterprise Governance & North-Star Platform
### Goals
Extend the MVP into reusable staffing infrastructure.

### Workstreams
- policy gateway
- role-based dashboards
- immutable audit/event log
- config versioning
- replay/simulation
- coverage / backup workers
- export/compliance tooling
- richer approval workflows

### Exit Criteria
- Enterprise accounts can govern worker behavior safely
- Runtime supports versioning and rollback
- Audit and export requirements are supportable

---

## Phase 6 - Generalize Beyond Athletics
### Goals
Abstract the framework for other industries.

### Approach
- keep workforce core generic
- domain packs become pluggable
- connector architecture supports additional vertical tools
- role templates adapt by vertical

### Candidate Verticals
- healthcare operations
- legal support ops
- recruiting/staffing
- agency operations
- local business growth ops

---

## Phase 7 - Voice / Calls / Advanced Channels
### Goals
Add receptionist-style and voice-first workers where they create strong leverage.

### Candidate workers
- reception/front desk
- event/ticketing information agent
- donor/booster concierge agent
- sponsorship intake agent

### Notes
Voice remains important but should not delay the athletics MVP core.

---

## Session Continuity / Delivery Discipline
- Always update `ROADMAP.md` when direction, features, or goals materially change
- Maintain fresh handoff/spec docs for active implementation slices
- Treat session memory loss as a product/process problem and mitigate it with startup protocols + durable files
- Prefer repo-backed continuity and explicit next-action notes over chat-only continuity

## Guiding Principles
- Do not disturb working CSOS operations
- Use CSOS as a connector, not a codebase to rewrite
- Normalize CSOS integration through a stable adapter/gateway
- Keep secrets isolated in connector services, not broad agent access
- Favor structured outputs and auditability over opaque autonomy
- Human approval gates for sensitive or external actions
- Sell the team before the software
- Treat workers as products with their own workspaces, not just prompts
