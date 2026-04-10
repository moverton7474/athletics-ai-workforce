# Route-by-Route Adoption Map

## Purpose
Define exactly where **Vision Board** patterns and **KSU CSOS** patterns should land first inside `athletics-ai-workforce`.

This map enforces the product split:
- **Vision Board** = visual system, branding tone, premium admin/settings UX, consent/autonomy patterns, staged rollout patterns
- **KSU CSOS** = workflow truth, queue/approval logic, governance, event/integration seams, role/ownership scoping, identity-resolution thinking
- **athletics-ai-workforce** = synthesis layer and product shell

## Core rules
1. Borrow Vision Board’s **trust/consent UX early**
2. Borrow CSOS’s **rules/governance/event architecture early**
3. Do **not** copy either repo wholesale
4. Keep athletics-ai-workforce as the **product synthesis layer**
5. Make future autonomy **visible, risk-tiered, and revocable**
6. Build a distinct athletics visual system under the Visionary umbrella
7. Use CSOS for **workflow truth**, not visual identity
8. Enforce schema-contract-implementation alignment harder than CSOS currently does

---

## Route adoption map

| Route / Surface | Priority | Vision Board patterns to adopt | CSOS patterns to adopt | What athletics-ai-workforce should own |
|---|---:|---|---|---|
| `/` home / landing | Soon | premium hero composition, polished CTA hierarchy, refined dark-card treatment, premium typography discipline | none directly beyond operator credibility/trust framing | athletics-specific value prop, enterprise/governed-AI messaging, proof surfaces tied to real workflows |
| `/dashboard` | **Now** | premium dark command-center shell, stat-card polish, subtle gradients, admin-console confidence | live work-queue thinking, realtime operator signal posture, explainability of surfaced work | continuity coverage, resolve-next orchestration, unified product command center |
| `/org/setup` | **Now** | guided onboarding shell, progress framing, premium card layout, cleaner step UX | role/ownership capture inputs that matter later for governance | athletics intake model, workforce-specific org questions, onboarding handoff logic |
| `/team` | **Now** | polished launch-package presentation, guided recommendation cards, premium “generated plan” UX | future role/ownership implications from organization design | workforce blueprint, rollout order, shared vs personal team design |
| `/workers` | **Now** | stronger visual hierarchy, refined cards, admin-console polish, premium badges | ownership/portfolio thinking, clear role/accountability surfaces | shared vs personal worker product model, workload summaries, operator-facing worker system |
| `/workers/[workerId]` chat | **Now** | trust-building layout, premium shell, cleaner route-entry context and autonomy messaging | queue ownership, approval dependencies, role/accountability thinking | worker mission, continuity, linked tasks/approvals/memory, operator trust surface |
| `/workers/[workerId]/outputs` | Soon | premium artifact cards, clearer review polish, status badge refinement | explainable work-item lineage, operator review posture | generated output library tied to worker ownership and next actions |
| `/workers/[workerId]/guidelines` | Soon | admin/settings clarity, segmented policy cards, readable premium settings shell | rules/governance posture, role-specific operating boundaries | worker operating instructions, allowed behavior, escalation and collaboration rules |
| `/workers/[workerId]/settings` | **Now/Soon** | **high-value Vision Board borrow**: autonomy settings, confidence thresholds, channel preferences, quiet hours, consent framing | approval thresholds, risk tiers, ownership scoping, auditability expectations | worker autonomy controls, private vs shared posture, future worker policy center |
| `/tasks` | **Now** | better list density and card polish, refined status indicators | CSOS work queue model, prioritization, explainability, ownership visibility | human task queue, cross-worker work management, memory-aware queue UX |
| `/tasks/[taskId]` | **Now** | premium detail-shell polish, clearer summary blocks, trust signals | task → approval → outcome chain, operator explainability, audit context | explicit ownership, linked worker, linked memory, next-action clarity |
| `/approvals` | **Now** | admin-grade review queue layout, high-confidence risk/status visuals | approval thresholds, approval queue posture, role-based visibility, governance | workforce approval inbox, review list, operator trust and escalation shell |
| `/approvals/[approvalId]` | **Now** | **high-value Vision Board borrow**: pending action card patterns, risk/confidence framing, time-bounded action clarity | approval state machine, workflow step log, audit context, human-in-the-loop execution | product-grade approval review page with context, dependencies, outcome routing |
| `/knowledge` | Soon | cleaner premium organization of reference vs memory cards | structured provenance and governance posture where useful | split between org knowledge, worker memory, personal memory, continuity operations |
| `/voice` | Later | staged rollout / feature-flag posture, trust messaging around voice actions | voice → query → navigate → action pattern, confirmation gates, answer+navigate parity | athletics voice shell, visible voice state, future worker-owned voice behaviors |
| `/segments` | **Now/Soon** | cleaner high-value list UX and signal hierarchy | deterministic query/filter state, operator explainability from CSOS-style data/queue logic | segment discovery shell and campaign handoff UX |
| `/segments/[segmentKey]` | **Now/Soon** | premium detail shell, better action framing, polished campaign launch CTA treatment | live query-backed segment truth, entity/segment context carrying into downstream workflow | segment context, recommended next action, route-entry handoff into campaign builder |
| `/campaigns/new` and `/campaigns/new/from-segment` | **Now/Soon** | premium multi-step builder, card/grouping quality, progressive disclosure, future consent copy around outreach | deterministic state handoff, workflow truth, human-control-first flow, approval gates | campaign builder shell, channel selection, operator overrides, route-state parity |
| `/campaigns/drafts/[draftId]/review` | **Now/Soon** | premium review surface, grouped asset cards, status/risk polish | review → approval transition, explicit blocked actions, workflow step progression | human review of generated assets and visible route into approvals |
| `/campaigns/[campaignId]/results` | Soon | polished metrics/result storytelling, premium summary cards | workflow outcome traceability, event-driven result state, follow-up queue logic | results interpretation, recommended next campaign, operator-facing follow-up context |
| `/campaigns/[campaignId]/follow-up` | Soon | admin-grade scheduled-notification / recommendation cards | work queue and escalation logic, future event/notification orchestration | follow-up planner and next-campaign orchestration shell |
| `/connector-runs` | Soon | cleaner operator-console layout, premium system-health cards | integration registry posture, run logs, auditability, delivery/result state | normalized connector outcome shell with workforce-readable context |
| future `/admin` or policy center | **High future priority** | **strongest Vision Board reuse area**: feature flags, communication settings, consent flows, quiet hours, channel preferences, pending actions, rollout controls | role-based visibility, approval thresholds, event/audit posture, integration registry summaries | athletics-ai-workforce policy center for autonomy, permissions, connectors, memory governance, channel governance |
| future `/admin/consent` | **High future priority** | communication preference UX, formal consent capture, revocation history, user-facing expectation language | approval + policy linkage, role-aware visibility, audit logging | formal org/user/channel consent model for outreach and AI-triggered communication |
| future `/admin/feature-flags` | Future | fail-closed feature flags, cohort rollout, premium module gating | environment/governance discipline | staged rollout control for autonomy/voice/premium modules |
| future `/admin/integrations` | Future | clean connection-state UX, optimistic admin controls, helpful status messaging | integration registry, health, sync direction, auth mode, delivery visibility | connector management console that stays productized above raw CSOS details |

---

## Adoption sequence by leverage

### First wave — adopt now
These are the highest-leverage places to merge the two reference systems immediately:
1. `/dashboard`
2. `/workers`
3. `/workers/[workerId]`
4. `/tasks/[taskId]`
5. `/approvals/[approvalId]`
6. `/workers/[workerId]/settings`
7. `/campaigns/new/from-segment`
8. `/campaigns/drafts/[draftId]/review`

### Second wave — after the core shell stabilizes
1. `/segments`
2. `/segments/[segmentKey]`
3. `/campaigns/[campaignId]/results`
4. `/campaigns/[campaignId]/follow-up`
5. `/connector-runs`
6. `/knowledge`

### Third wave — future policy/governance layer
1. future `/admin`
2. future `/admin/consent`
3. future `/admin/feature-flags`
4. future `/admin/integrations`
5. future org policy + worker autonomy controls

---

## Concrete pattern mapping

### Borrow from Vision Board first
Use these early in athletics-ai-workforce:
- premium dark token system
- card polish + spacing hierarchy
- progress/onboarding shell
- autonomy settings language
- communication preference / consent flows
- quiet hours / preferred timing controls
- pending action review cards
- feature-flag / staged rollout controls

### Borrow from CSOS first
Use these early in athletics-ai-workforce:
- work queue / operator execution model
- role + ownership scoping
- approval thresholds
- collision/suppression rules
- event-driven workflow seams
- audit logging discipline
- workflow step state tracking
- identity resolution as an ingestion gate

---

## Guardrails

### Do not do this
- do not skin athletics-ai-workforce to look exactly like Vision Board
- do not import KSU-specific route sprawl or hardcoded assumptions
- do not copy CSOS edge functions without validating schema and contract alignment
- do not implement autonomy as a vague toggle without visible risk tiers and revocation

### Always do this
- make ownership obvious
- make autonomy visible
- make approvals explainable
- make route-state handoffs recoverable
- keep the shell productized even when backend logic comes from CSOS patterns

---

## Summary
The route-level rule is simple:
- **Vision Board lands first in presentation, settings, trust, and policy surfaces**
- **CSOS lands first in workflow truth, rules, approvals, queue logic, and integration architecture**
- **athletics-ai-workforce owns the final synthesis as a governed athletics operator platform under the Visionary umbrella**
