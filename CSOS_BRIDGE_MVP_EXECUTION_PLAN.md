# CSOS Bridge MVP — One-Page Execution Plan

## Objective
Stand up the first real bridge between `athletics-ai-workforce` and `KSU CSOS` so athletics-ai-workforce can operate as the governed AI workforce shell while CSOS serves as the athletics-domain data and execution backend.

This MVP should prove one narrow real workflow:

**Query a live KSU ticket-sales cohort from CSOS → surface it as a usable segment in athletics-ai-workforce → move it through draft/review/approval → prepare or request downstream execution.**

---

## Product Split
### athletics-ai-workforce owns
- operator shell
- workers
- tasks
- approvals
- memory / continuity
- campaign workflow UX
- cross-system audit framing

### KSU CSOS owns
- source-of-truth athletics data
- domain query logic
- ticket-sales workflow rules
- segmentation and pipeline logic
- execution backends
- internal voice / agent routing if needed

---

## MVP Definition
The MVP is successful when a user can:
1. open a CSOS-backed segment in athletics-ai-workforce
2. review a real cohort such as football non-renewals or top football prospects
3. launch a governed campaign workflow from that segment
4. move the workflow through review and approval inside athletics-ai-workforce
5. hand the approved action toward a CSOS-backed downstream execution path or execution-ready draft state

---

## Selected First Workflow
### Locked workflow
**KSU Football Non-Renewals**

Why this first:
- already aligned with current athletics-ai-workforce voice/MVP planning
- clear ticket-sales value
- easier to explain and validate operationally
- naturally leads into campaign draft + review + approval

### Strong alternative later
**Top Football Season Ticket Prospects**

Use this as the next cohort after the first bridge succeeds or if the available CSOS query path proves materially easier than non-renewals.

---

## Execution Sequence

### Phase 1 — Finish the athletics front door
**Goal:** Make the segment side of athletics-ai-workforce strong enough to receive real CSOS-backed data.

Deliverables:
- upgrade `/segments`
- upgrade `/segments/[segmentKey]`
- make segment provenance, next action, and recoverable filters explicit
- ensure CSOS-backed segments feel first-class, not special-case stubs

Exit criteria:
- segment list/detail UX feels consistent with the strengthened campaign workflow spine
- users can clearly see what came from CSOS and what next action is available

---

### Phase 2 — Define the bridge contract before coding
**Goal:** Freeze a narrow stable handshake.

Deliverables:
- capability inventory of current CSOS query/execution surfaces
- request/response schema for athletics ↔ CSOS
- auth model decision
- audit metadata requirements
- sync vs async decision model

Initial capability scope:
- `ticketing.prospects.segment`
- `ticketing.renewal_risk.list`
- `constituents.search`
- optional: `constituents.profile`

Exit criteria:
- both systems have a shared contract for the first read bridge
- athletics does not depend directly on unstable CSOS frontend service details

---

### Phase 3 — Build the first read bridge
**Goal:** Pull live CSOS data into athletics-ai-workforce safely.

Deliverables:
- narrow server-side adapter implementation in athletics-ai-workforce
- first live CSOS-backed read path wired into the segment shell
- mapped result shape for segment context + cohort metadata
- visible source/provenance in athletics UI

Exit criteria:
- athletics-ai-workforce can show a real CSOS-backed ticket-sales cohort
- the cohort can be used as the start of a campaign workflow

---

### Phase 4 — Governed workflow handoff
**Goal:** Prove that athletics-ai-workforce remains the control shell.

Deliverables:
- launch campaign builder from CSOS-backed segment
- persist draft/review/approval state in athletics-ai-workforce
- approval rule for cross-system actions made explicit
- define what counts as “execution-ready” output

Exit criteria:
- the user can move from live CSOS data to a governed approved workflow inside athletics-ai-workforce

---

### Phase 5 — Controlled downstream execution
**Goal:** Stage the first execution-capable handoff without overexpanding scope.

Options:
- **Option A:** execution-ready draft only
- **Option B:** CSOS compose/preview handoff
- **Option C:** approval-gated CSOS schedule/send handoff

Recommendation:
- start with **Option A or B**
- treat full send/schedule as the next step unless envs/access are already clean

Exit criteria:
- approved work can be handed off in a structured way without bypassing governance

---

## Priority Order
1. strengthen athletics `/segments`
2. strengthen athletics `/segments/[segmentKey]`
3. create CSOS capability inventory
4. create athletics↔CSOS handshake spec
5. confirm first live workflow (`football non-renewals` recommended)
6. decide auth + audit model
7. build first read-only bridge
8. verify live CSOS-backed segment in athletics
9. route that segment into campaign draft/review/approval
10. only then add controlled downstream execution

---

## Owners / Responsibility Split
### Milton
- confirm first workflow
- confirm preferred first data source path in CSOS
- confirm what level of execution the MVP must reach
- confirm who the approver/operator is for pilot validation

### athletics-ai-workforce build track
- segment shell upgrades
- bridge adapter design and implementation
- task/approval/memory governance
- campaign workflow continuation from live segment input

### KSU CSOS build track
- expose or normalize the first stable read capability
- validate auth pattern for server-to-server access
- identify the safest existing function/query path for the chosen cohort
- optionally prepare compose/preview/send handoff capability after read path succeeds

---

## Dependencies
- access to live CSOS environment or stable bridge auth
- clear first cohort/workflow selection
- agreement on request/response payloads
- agreement on where approval authority lives
- enough production stability in athletics-ai-workforce segment routes to carry real data

---

## MVP-First Principles
- do **not** start with voice-agent-to-voice-agent integration
- do **not** build broad connector coverage first
- do **not** let athletics-ai-workforce depend directly on unstable CSOS frontend contracts
- do **not** bypass athletics approvals for cross-system execution
- do **not** widen channel execution scope before the first read bridge works

---

## Not Now
These are explicitly later-phase items:
- broad multi-agent agent-to-agent orchestration
- full voice-to-voice handoff between products
- broad multi-channel autonomous execution
- wide CSOS capability surface beyond the first narrow read bridge
- duplicate ticket-sales intelligence logic inside athletics-ai-workforce

---

## Immediate Next Decision
The first workflow is now locked to:
- **Primary:** `KSU Football Non-Renewals`

The next concrete work should be:
1. segment route upgrades
2. capability inventory
3. handshake spec
4. first bridge implementation
