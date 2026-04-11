# CSOS Capability Inventory

## Purpose
Inventory the current KSU CSOS capabilities that are relevant to the first athletics-ai-workforce ↔ CSOS bridge.

This document is intentionally MVP-scoped.
It focuses on the capabilities most useful for the first real cross-system workflow, especially ticket-sales cohort retrieval and governed campaign handoff.

---

## Strategic Role of CSOS
KSU CSOS should be treated as the athletics-domain backend for:
- source-of-truth data access
- domain query logic
- ticket-sales segmentation
- ticketing/donor workflow execution
- internal agent/voice orchestration when needed

athletics-ai-workforce should consume these capabilities through a narrow adapter rather than coupling directly to CSOS frontend internals.

---

## Capability Readiness Levels
### Level A — Strong candidates for first bridge
Already visible in code and close to usable as stable capabilities.

### Level B — Real capability, but should be wrapped carefully
Exists in code but may need normalization, auth hardening, or narrower exposure.

### Level C — Later / not first bridge
Useful long-term, but not the best initial integration seam.

---

## Level A — Strong First-Bridge Candidates

### 1. Ticket prospect segmentation
**Recommended capability name:** `ticketing.prospects.segment`

**What exists now**
- `supabase/functions/ticket_pipeline/index.ts`
- `apps/web/src/services/ticketSalesService.ts -> segmentProspects()`

**Current native actions / behavior**
- action: `segment`
- filters include:
  - `sport`
  - `min_propensity`
  - `max_propensity`
  - `stage`
  - `has_paciolan`
  - `is_ticket_holder`
- supports `limit`
- returns prospect records with:
  - constituent identity
  - ticket spend
  - sport affinity
  - propensity score
  - recommendation

**Why this matters**
This is the best current path for:
- top football season ticket prospects
- non-ticket-holder football leads
- high-propensity ticket sales cohorts
- a first real segment back into athletics-ai-workforce

**Bridge recommendation**
Expose this as a normalized read capability first.

---

### 2. Ticket renewal risk list
**Recommended capability name:** `ticketing.renewal_risk.list`

**What exists now**
- `apps/web/src/services/scoreService.ts -> getConstituentsByRenewalRisk()`
- voice tool references for renewal risk queries
- scoring model already stores renewal risk in `scores`

**Current native behavior**
- risk levels: `high`, `medium`, `low`
- joins constituent + score data
- returns latest grouped score records by constituent

**Why this matters**
This is the most direct path for:
- football non-renewals or likely churn cohorts
- retention workflows
- high-value outreach prioritization

**Bridge recommendation**
Very strong candidate for the first or second read bridge capability.

---

### 3. Constituent search
**Recommended capability name:** `constituents.search`

**What exists now**
- `apps/web/src/services/constituentService.ts -> searchConstituents()`
- voice tool references in `voiceDataTools.ts`

**Current native behavior**
- search by:
  - first name
  - last name
  - email
  - phone
- returns up to 50 matches

**Why this matters**
Useful for:
- resolving a lead after a cohort is returned
- follow-up enrichment flows
- operator drill-in from athletics-ai-workforce

**Bridge recommendation**
Include in first bridge if we want operator-friendly search from athletics.

---

### 4. Constituent profile / transaction history
**Recommended capability name:** `constituents.profile`

**What exists now**
- service layer support for constituent records
- voice data tool definitions include profile/transaction-style actions
- direct data model includes transaction and touch history relationships

**Why this matters**
This is useful immediately after segment selection, especially for:
- top lead review
- prospect research workflow
- high-touch premium sales workflows

**Bridge recommendation**
Optional for first bridge, but very useful as the next read surface after search/segment.

---

### 5. Ticket pipeline summary
**Recommended capability name:** `ticketing.pipeline.summary`

**What exists now**
- `supabase/functions/ticket_pipeline/index.ts -> analyze`
- `apps/web/src/services/ticketSalesService.ts -> analyzePipeline()`

**Current native behavior**
- aggregates ticket opportunity pipeline by stage
- returns total value, counts, conversion rate

**Why this matters**
Useful for dashboarding and executive context, but not as mission-critical as prospect segmentation for the first bridge.

**Bridge recommendation**
Good early read capability, but after prospect segmentation and renewal risk.

---

## Level B — Real Capabilities That Need Careful Wrapping

### 6. Ticket outreach composition / preview
**Recommended capability names:**
- `ticketing.outreach.compose`
- `ticketing.outreach.preview`

**What exists now**
- `supabase/functions/ticket_outreach/index.ts`
- `apps/web/src/services/ticketSalesService.ts -> composeOutreach(), previewOutreach()`

**Current native behavior**
- channel-aware content generation
- can compose/preview for specific constituents
- pulls campaign context and constituent context
- AI content generation with fallback behavior

**Why this matters**
This is the cleanest bridge after read capabilities succeed.
It would allow athletics-ai-workforce to:
- request a draft from real CSOS context
- keep human review/approval in athletics
- avoid bypassing domain logic

**Bridge recommendation**
Wrap after the first read bridge is stable.
Do not make this the first integration step.

---

### 7. Ticket outreach schedule / send
**Recommended capability names:**
- `ticketing.outreach.schedule`
- `ticketing.outreach.send`

**What exists now**
- `supabase/functions/ticket_outreach/index.ts`
- provider wiring for SendGrid / Twilio
- channel support for email, SMS, and voice-oriented flow paths

**Why this matters**
This is the first place where real external execution starts happening.
It is valuable, but higher risk than read/query capabilities.

**Bridge recommendation**
Do not expose first.
Use only after:
- approvals are clearly mapped
- auth/audit are finalized
- first read bridge works
- operator signoff model is explicit

---

### 8. Ticket campaign lifecycle management
**Recommended capability names:**
- `ticketing.campaign.create`
- `ticketing.campaign.update`
- `ticketing.campaign.activate`
- `ticketing.campaign.pause`
- `ticketing.campaign.complete`

**What exists now**
- `supabase/functions/ticket_campaign_manager/index.ts`
- `apps/web/src/services/ticketSalesService.ts`

**Why this matters**
This becomes useful when athletics-ai-workforce needs to hand approved work to CSOS as an execution backend.

**Bridge recommendation**
Stage this after segment/query and draft/preview paths are working.

---

### 9. Pipeline stage movement
**Recommended capability name:** `ticketing.pipeline.move_stage`

**What exists now**
- `supabase/functions/ticket_pipeline/index.ts -> move_stage`

**Why this matters**
Potentially valuable for routing and rep workflow updates.
But it is a mutation and should not be first.

**Bridge recommendation**
Later-phase bridge capability.

---

## Level C — Later / Not the First Bridge

### 10. Voice command runtime
**Native surface**
- `supabase/functions/voice_command/index.ts`
- `_shared/voice_logic.ts`
- `apps/web/src/features/voice_console/*`

**Assessment**
The voice layer is a strong UX surface but not the best first cross-system contract.

**Recommendation**
Do not make athletics-ai-workforce depend on the CSOS voice runtime as the first handshake.
Use named capability bridges instead.

---

### 11. Agent orchestrator / multi-agent runtime
**Native surface**
- `supabase/functions/agent_orchestrator/index.ts`
- `supabase/functions/multi_agent_chain/index.ts`
- related agent functions

**Assessment**
Promising and real, but too open-ended for the first bridge.

**Recommendation**
Let CSOS internally decide whether a capability uses orchestrator logic.
Do not expose raw agent-to-agent orchestration as the first integration interface.

---

### 12. Broad campaign/email/analytics surface
There are many additional CSOS capabilities in code:
- `ai_sales_campaign`
- `campaign_attribution`
- `sms_campaign_dispatch`
- `voice_outbound_dispatch`
- `voice_call_intelligence`
- broader proactive intelligence and analytics tooling

**Recommendation**
Treat these as later-phase capabilities after the first bridge proves out.

---

## Recommended First Capability Set
These are the capabilities I recommend exposing first from CSOS to athletics-ai-workforce:

### Phase 1 — Read bridge
1. `ticketing.prospects.segment`
2. `ticketing.renewal_risk.list`
3. `constituents.search`
4. optional: `constituents.profile`

### Phase 2 — Draft bridge
5. `ticketing.outreach.compose`
6. `ticketing.outreach.preview`

### Phase 3 — Controlled execution bridge
7. `ticketing.outreach.schedule`
8. `ticketing.outreach.send`
9. `ticketing.campaign.create` / `activate`

---

## Best First Workflow Match
### Recommended
**KSU Football Non-Renewals**

### Strong alternative
**Top Football Season Ticket Prospects**

These map most cleanly to the existing CSOS capabilities and the current athletics-ai-workforce MVP direction.

---

## Key Rule
athletics-ai-workforce should call **stable capability contracts**, not internal CSOS UI logic or conversational voice surfaces.

The bridge should treat CSOS as:
- a domain data/query backend
- a workflow execution backend
- an internal agent system whose internals remain abstracted behind the adapter
