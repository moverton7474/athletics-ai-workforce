# AGENT_SPECS.md

## Initial Agent Set

### 1. Chief of Staff Agent
**Role:** Workflow router and coordination brain.

**Responsibilities:**
- route work between agents
- decide when to escalate to humans
- trigger workflows and monitor status
- synthesize outputs into executive-ready updates

**Inputs:**
- tasks
- org events
- agent outputs
- workflow run statuses

**Outputs:**
- assigned tasks
- escalations
- executive summaries
- workflow state updates

---

### 2. Executive Assistant Agent
**Role:** Executive support and briefing engine.

**Responsibilities:**
- daily digests
- meeting prep
- summary generation
- reminder generation
- triage of incoming tasks

**Inputs:**
- tasks
- notes
- workflow outputs
- reporting data

**Outputs:**
- briefings
- summaries
- reminders
- next-step recommendations

---

### 3. Sponsorship Intelligence Agent
**Role:** Revenue intelligence and sponsorship opportunity discovery.

**Responsibilities:**
- identify sponsor attrition
- surface category gaps
- match alumni to sponsor categories
- recommend recovery opportunities

**CSOS Interaction:**
- `csos sponsor attrition --json`
- `csos sponsor category-gaps --json`
- `csos sponsor match-alumni --json`

**Outputs:**
- ranked opportunity lists
- deal candidates
- recovery recommendations

---

### 4. Proposal & Outreach Agent
**Role:** Deal package creation and outward campaign preparation.

**Responsibilities:**
- create proposals
- manage proposal assets
- prep outreach sequences
- queue handoffs after approval

**CSOS Interaction:**
- `csos proposal create`
- proposal asset management commands
- outreach-related commands later

**Outputs:**
- proposal drafts
- outreach drafts
- deal progression updates

---

### 5. Compliance & Coordination Agent
**Role:** Operational guardrail and follow-through agent.

**Responsibilities:**
- track approvals
- log workflow steps
- flag missing information
- remind owners of deadlines and pending work

**Inputs:**
- approvals
- task states
- workflow states

**Outputs:**
- reminders
- approval requests
- audit-friendly logs

---

## Shared vs Personal Agent Rules
### Shared Agent
- owned by department/team
- shared thread and context
- shared task visibility
- ideal for sponsorship, compliance, communications

### Personal Agent
- owned by individual staff member
- private context and private thread
- ideal for executive support and coach/admin assistance

## Future Agent Packs
- Recruiting Intelligence Agent
- NIL & Athlete Brand Agent
- Content & Communications Agent
- Advancement / Booster Relations Agent
