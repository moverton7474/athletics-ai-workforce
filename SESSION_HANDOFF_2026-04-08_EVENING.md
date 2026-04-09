# SESSION_HANDOFF_2026-04-08_EVENING.md

## Current Objective
Continue building `athletics-ai-workforce` as the primary product shell first, while keeping CSOS integration narrow and adapter-driven until the workforce core is stronger.

## Strategic Execution Priority (Current)
Follow the reordered roadmap (Option B):

### NOW
1. core workforce UX / product shell
2. shared vs personal worker model
3. onboarding / team generation
4. workflow / approval operating loop
5. session continuity / memory discipline
6. agent memory infrastructure direction
7. minimal strategic connector proof only

### NEXT
- first live CSOS adapter-backed read path
- proposal send path through adapter-oriented workflow actions
- stronger in-product memory controls and agent-to-agent continuity surfaces
- deeper voice/manual parity for top workflows

### LATER
- broader CSOS mutation coverage
- Salesforce / Paciolan / Blackbaud gateway expansion
- billing / packaging / self-serve onboarding
- enterprise admin management console depth
- enterprise governance + generalized platform expansion

## Current Product State
### Confirmed implemented
- live Supabase-backed production app exists
- auth + membership scaffold exists
- role-aware navigation and privileged gating are active
- connector run history has a dedicated surface
- proposal review workflow has structured approval metadata, approval decisions, and a dedicated review page
- dashboard shows approvals, connector outcomes, and next actions
- worker workspace shell is materially stronger:
  - workers roster
  - worker detail/chat shell
  - outputs / guidelines / settings surfaces
- shared vs personal worker model is clearer in the roster and settings surfaces
- org setup now behaves more like onboarding:
  - onboarding promise cards
  - live team recommendation preview
- generated workforce blueprint page now exists at `/team`
- task workflow surfaces are stronger:
  - richer task list
  - task detail pages
  - dashboard links into tasks
- knowledge brain now distinguishes:
  - organization memory
  - worker memory
  - personal memory
- knowledge brain now includes a recent continuity feed so memory stays visible alongside reference knowledge
- worker workspace chat surface now includes continuity context with recent memory, linked tasks, and approval dependencies
- task detail now surfaces linked approvals, downstream approval outcomes, and related memory for the assigned worker
- approval detail now surfaces the workflow transition more clearly with origin task, decision state, outcome task, and decision history
- knowledge page now includes a server-backed memory capture form that writes to `memory_entries` through `/api/memory-entries`
- worker chat pages now include worker-scoped memory capture, and dashboard now surfaces recent memory alongside tasks and approvals
- memory cards now support edit, delete, and pin/unpin actions through `/api/memory-entries/[memoryEntryId]`
- startup/session continuity protocol has been documented in the workspace
- CSOS repo `GF-Accelerate/ksu-csos` was reviewed directly
- CSOS adapter architecture/spec and code scaffold were added

## Current Architecture Direction
### athletics-ai-workforce owns
- onboarding
- recommended workforce generation
- worker workspaces
- tasks
- approvals
- workflow orchestration
- knowledge / memory shell
- commercialization / productization

### CSOS owns
- athletics-domain backend execution
- domain data/workflow logic where already mature

### Integration rule
Use a stable **CSOS adapter/gateway**. Do not couple athletics-ai-workforce directly to unstable CSOS frontend service contracts.

## Latest Important Commits
Use these as the immediate resume anchors:
- `e136fef` — Strengthen knowledge and memory surfaces
- `5d8d791` — Add generated workforce blueprint flow
- `74b8c04` — Add admin and memory infrastructure roadmap goals
- `5d5706c` — Improve task workflow surfaces
- `d442655` — Clarify shared and personal worker modes
- `9787b86` — Add onboarding and team recommendation flow
- `91c47c5` — Build richer worker workspace shell
- `123e473` — Reorder roadmap around core-first priorities
- `60a1e6d` — Add CSOS adapter contract scaffold
- `e11b7e8` — Update roadmap for CSOS adapter direction
- `c1462e2` — Enrich approval decision workflow state
- `185468c` — Add approval review detail workflow slice

## Key Docs To Read First Next Session
Read in this order:
1. `NEW_SESSION_HANDOFF.md`
2. `ROADMAP.md`
3. `PHASE_2_3_IMPLEMENTATION_PLAN.md`
4. `CSOS_ADAPTER_SPEC.md`
5. `INTEGRATION_GATEWAY_ARCHITECTURE.md`
6. `SESSION_HANDOFF_2026-04-08_EVENING.md`
7. workspace `SESSION_STARTUP_PROTOCOL.md`

## Recommended Resume Order
1. inspect `ROADMAP.md`
2. inspect `SESSION_STARTUP_PROTOCOL.md`
3. inspect this handoff file
4. check `git status --short`
5. continue the core-system build before broad connector expansion

## Best Next Build Step
The next highest-leverage core-system step is to deepen the **memory / continuity + workflow shell** further, for example:
- stronger in-product memory controls / views
- clearer agent-to-agent communication memory design
- stronger task → approval → next-step transitions
- eventually, one narrow live CSOS-backed read path only after the shell is stronger

## Notes on Memory / Continuity
This session explicitly elevated memory continuity as a roadmap priority.

Important principle:
- treat memory continuity as core infrastructure, not optional polish
- sessions should recover from files, not chat scrollback
- roadmap + handoff + startup protocol should stay in sync

## Constraints / Guardrails
- do not broaden connector work too early
- do not let CSOS integration overtake the product shell build
- do not store raw secrets in durable docs
- keep roadmap updated whenever direction or feature state materially changes

## Current HEAD
- `e136fef`
