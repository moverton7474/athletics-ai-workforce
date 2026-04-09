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

## Execution Priority - Now / Next / Later

### NOW — Primary build focus (Option B)
Focus on the core workforce product before broad connector expansion.

#### 1. Core workforce UX / product shell
- strengthen worker workspace quality
- improve chat / outputs / guidelines / settings experience
- make the roster + worker surfaces feel product-grade

#### 2. Shared vs personal worker model
- make the operating model clearer in UX and data flow
- reinforce team collaboration vs private worker behavior

#### 3. Onboarding / team generation
- move toward a real intake → team recommendation/generation flow
- build the product layer that sells the workforce before deep backend integration

#### 4. Workflow / approval operating loop
- continue hardening proposal review orchestration
- improve next-action visibility, task clarity, and review flows
- keep the app centered on governed work, not just connector actions

#### 5. Session continuity / memory discipline
- startup protocol
- handoff discipline
- roadmap discipline
- durable memory updates as part of normal delivery

#### 6. Agent memory infrastructure
- robust session-to-session memory persistence
- scoped memory for worker continuity
- agent-to-agent communication memory / handoff model
- task remembrance across sessions so work does not disappear with context resets

#### 7. Minimal strategic connector proof only
- keep CSOS adapter work narrow
- implement one live CSOS-backed read path
- avoid broad connector expansion until the core product shell is stronger

### NEXT — After the core shell is stronger
- first live CSOS adapter-backed read path
- proposal send path through adapter-oriented workflow actions
- selective expansion of reporting / sponsorship reads
- deeper voice/manual parity for top workflows
- stronger in-product memory controls and agent-to-agent continuity surfaces

### LATER — Broad integration + productization
- expanded CSOS mutation coverage
- Salesforce / Paciolan / Blackbaud gateway expansion
- billing / packaging / self-serve onboarding
- enterprise governance depth
- broader vertical generalization

## Current Live State (2026-04-09)
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
- worker workspace shell now has stronger chat / outputs / guidelines / settings surfaces with role-specific mock content
- workers view now distinguishes shared vs personal worker models more clearly in roster, copy, and settings surfaces
- org setup now includes a clearer onboarding promise and live recommended team preview during intake
- generated workforce blueprint page now exists to bridge onboarding into the recommended team launch path
- task queue now has a richer list surface plus task detail pages to support next-action workflow UX
- knowledge brain now distinguishes organization, worker, and personal memory scopes more clearly in the product shell
- knowledge brain now includes a recent continuity feed so operational memory is visible alongside durable knowledge
- worker workspace chat surface now includes continuity context with recent memory, linked tasks, and approval dependencies
- task and approval detail pages now surface workflow transitions more clearly, including origin tasks, outcome tasks, decision history, and related memory context
- in-product memory capture now exists through a server-backed `/api/memory-entries` path and a capture form in the knowledge surface
- worker workspaces now support worker-scoped memory capture directly, and the dashboard now rolls recent memory into the command-center view
- memory entries now support lightweight management actions in-product: edit, delete, and pin/unpin through server-backed routes
- memory capture now supports optional task linkage, and task views can surface task-linked memory explicitly
- tenant-safe memory policy tightening is now staged and remotely applied through dedicated memory-entry RLS/index migrations
- memory capture now supports optional approval linkage, and approval review surfaces can show approval-linked memory directly
- pinned memory is now elevated into dashboard and worker continuity rollups
- dashboard now includes continuity coverage mapping across workers, open tasks, and pending approvals so continuity gaps are visible instead of hidden, including a resolve-next queue for the most urgent continuity gaps
- memory capture, edit, pin/unpin, and delete actions now update in place across the current surface instead of forcing a full-page reload
- onboarding now hands live intake state into the generated workforce blueprint instead of dropping into a disconnected static page
- generated workforce blueprint now acts like a real launch package: org-specific summary, recommended rollout sequence, shared-vs-personal operating model summary, first-week operating checklist, and direct links into workers, dashboard, approvals, and knowledge surfaces
- task detail and approval detail pages now include explicit operator next-action guidance plus direct navigation to related workflow surfaces
- smoke coverage now validates the expanded product shell end to end across public pages, onboarding handoff, generated workforce blueprint, task detail surfaces, and approval detail surfaces; deployed production verification reached 17/17 passing tests in this session
- user screenshots from this session confirm the live continuity coverage, workers, tasks, and knowledge surfaces are rendering in production as expected
- CSOS production repo (`GF-Accelerate/ksu-csos`) has now been reviewed directly and will guide the next integration phase

### Immediate next build target
Execute Option B: finish the core workforce system shell and workflow loop first, while limiting connector work to a narrow proof of architecture.

### Immediate implementation priorities
1. strengthen worker/workspace product quality
2. define or improve the onboarding → team generation flow
3. continue Phase 2.3 workflow/approval hardening
4. enforce startup/handoff/memory continuity discipline
5. keep CSOS integration limited to adapter refinement + one live read path

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
- show me hot leads / donor leads style list retrieval
- voice-driven page reveal while speaking (query first, then move the UI to the relevant screen)
- launch campaign / proposal / approval workflows from the same conversation context

### CSOS Voice Analysis Findings (2026-04-09)
A fresh review of the KSU CSOS codebase shows the current in-app voice agent already proves the interaction pattern we want to preserve and adapt:
- explicit **page navigation registry** exists in `ksu-csos/apps/web/src/features/voice_console/voiceNavigationTools.ts` with aliases for many modules and a tool-based `navigate_to_page` action
- explicit **data query / workflow tool layer** exists in `ksu-csos/apps/web/src/features/voice_console/voiceDataTools.ts` with tools for dashboard summaries, hot leads, donor/prospect lookup, campaign operations, workflow execution, approvals, and navigation helpers
- CSOS voice supports **search + navigate** patterns, including things like opening a person record or agent detail after resolving the entity
- CSOS voice preserves **manual navigation parity**: voice triggers navigation or workflow actions, but the user can still click/type through the same system manually
- CSOS conversational surfaces include **session continuity**, **confirmation gates for sensitive actions**, **voice input + typed fallback**, and **display panels** for returned data (`VoiceConsole.tsx`, `VoiceBrain.tsx`)

These findings reinforce the correct MVP direction for athletics-ai-workforce: voice should sit on top of the same product shell and action model, not replace it.

### CSOS-Informed MVP Voice Requirements
- every high-value operator workflow must have **manual + voice parity**
- voice should support three modes: **answer**, **navigate**, and **execute**
- voice queries should be able to **answer from live data** and then optionally **take the user to the relevant page** in the same flow
- workflow-triggering commands must preserve **human approval gates** for consequential actions
- the same underlying services/actions should power both button-click execution and voice-command execution
- navigation should support both **page-level routing** and **entity-aware routing** (example: hot leads list, donor profile, proposal, campaign builder)
- the system should expose visible feedback about what voice just did: answered only, navigated, or launched a workflow
- manual navigation must remain first-class; voice is an acceleration layer, not the only control path

### MVP Voice-Complete Workflow Candidates
These are the strongest first workflows to make voice-complete while staying inside the MVP shell:
1. **Query non-renewed 2026 KSU football season ticket holders** → answer from live data + immediately navigate to the relevant filtered queue/list
2. **Build KSU Football Season Ticket Sales Campaign** → open a prefilled campaign builder from the current segment context, let the user choose channel mix (email / SMS / voice call / personalized video), generate campaign assets, route those assets into review, require human approval, then schedule execution
3. **Show hot leads / donor leads** → answer + immediately navigate to the relevant filtered list while the conversation continues
4. "Show me sponsor attrition risks" → answer + navigate to connector/task surface
5. "Build a proposal for [sponsor]" → create workflow shell + route into review surface
6. "Open pending approvals" / "Approve this" / "Request changes" → governed approval loop
7. "What should I work next?" → dashboard/queue summary + navigate to the top next action
8. **Ask for campaign results / campaign follow-up** → voice agent should be able to report results, surface scheduled follow-up notifications, and recommend a next campaign when the previous one underperformed
+
+### Product Decisions Confirmed By Milton (2026-04-09)
+- voice navigation should **immediately navigate while answering**, following the stronger CSOS behavior pattern rather than pausing to ask whether the page should open
+- all meaningful workflow execution should remain **human-in-the-loop**, especially campaign approval, launch, and other consequential actions
+- the first campaign-building MVP should **open a prefilled builder page** rather than silently completing the entire flow in the background; the user should retain visible control over segment, channel selection, asset review, approval, and scheduling
+- campaign channel selection in the voice-driven builder flow should support **email, SMS, voice call, and personalized video message**
+- the voice agent should eventually support **campaign result follow-up**, including timed notifications and recommendation of a new campaign when the prior campaign is not successful

### Voice-Complete MVP Implementation Plan (planning only — do not build the full voice layer yet)
#### 1) Campaign builder shell / prefill model
Goal: create the product shell that a future voice command can open and prefill without hiding the workflow from the operator.

Planned MVP shell behavior:
- a campaign builder route that can open in manual mode or prefilled mode
- builder must accept a structured handoff payload, not just loose text
- required builder inputs:
  - segment / audience source
  - campaign objective
  - sport / business context
  - channel mix (email, SMS, voice call, personalized video)
  - operator notes / strategic intent
- builder should show which fields came from voice/system context versus what the operator manually changed
- the first version should focus on **prefill + review + edit**, not hidden autonomous completion

Suggested MVP data model additions:
- `segmentContext`
- `campaignDraftIntent`
- `channelSelection`
- `prefillSource` (voice, manual, workflow, imported)
- `operatorOverrides`

#### 2) Segment-to-campaign handoff architecture
Goal: let a user ask for a segment, inspect it, and then launch directly into a campaign build flow without losing context.

Required behavior:
- the system should preserve the selected segment context from the query surface into campaign creation
- the handoff should work whether the segment was reached by manual navigation or voice query
- first target segment examples:
  - 2026 KSU football non-renewals
  - hot leads / donor leads
  - future sponsorship attrition cohorts
- the handoff payload should include:
  - segment ID or deterministic filter definition
  - segment label
  - count / estimated audience size
  - why this segment exists
  - recommended campaign objective

MVP principle:
- the segment should become a reusable object or deterministic filter state, not just a one-off voice result blob

#### 3) Approval / review flow for generated assets
Goal: generated campaign assets must move through a visible human review step before scheduling or launch.

Required MVP flow:
- campaign draft created
- assets generated per selected channel
- review surface shows generated assets grouped by channel
- operator can approve, reject, or request changes
- only approved assets can move into scheduling/execution
- review flow must work whether the draft was launched manually or from a voice-prefilled builder

First channel review targets:
- email
- SMS
- voice call script
- personalized video message

MVP rule:
- voice may initiate or prefill, but asset approval remains explicit and human-controlled

#### 4) Shared route/state model for voice + manual parity
Goal: voice and manual UI should hit the same underlying surfaces and state model.

Required MVP architecture:
- the same route should open whether reached by click or by voice navigation
- the same action handlers should be used by manual buttons and future voice commands
- state should distinguish:
  - answer-only
  - answer + navigate
  - answer + navigate + prefill
  - answer + navigate + action-pending-approval
- visible UI should tell the operator what just happened and what remains to be done

Core principle:
- voice is not a second app. It is another entry path into the same product shell.

#### Proposed MVP deliverable sequence
1. define campaign builder route + prefill contract
2. define segment object / deterministic filter handoff contract
3. define generated-asset review state model
4. define route/state parity contract for voice/manual entry
5. only after those are stable, begin voice-trigger implementation

### Exit Criteria
- command model defined for all five MVP workers
- first CSOS workflows mapped to voice triggers
- voice/manual interaction model documented
- first voice-complete workflow pack defined for athletics-ai-workforce with answer + navigate + execute parity
- campaign builder / segment handoff / asset review / shared route-state plan documented tightly enough to guide implementation without guesswork

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

### Priority note
This phase should advance in a constrained way until the core workforce product shell is stronger. Prioritize one live read path and one governed mutation path before expanding connector breadth.

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
- enterprise admin management console
- tenant / deployment / connector health management
- immutable audit/event log
- config versioning
- replay/simulation
- coverage / backup workers
- export/compliance tooling
- richer approval workflows
- memory governance and agent communication oversight

### Exit Criteria
- Enterprise accounts can govern worker behavior safely
- Admin users can manage deployments, tenants, connectors, and policy surfaces through a dedicated management console
- Runtime supports versioning and rollback
- Audit and export requirements are supportable
- Memory and agent communication flows are observable and governable

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
- Treat memory continuity as core infrastructure, not an optional enhancement
- Build agent communication and task remembrance so work survives session resets
- Sell the team before the software
- Treat workers as products with their own workspaces, not just prompts
