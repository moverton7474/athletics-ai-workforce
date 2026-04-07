# WORKFLOW_SYSTEM_DIAGRAMS.md

## Purpose
Visualize how the athletics-ai-workforce system operates now, how the agent team is structured, and how the platform connects to the College Sports Operating System (CSOS) as the product matures.

---

## 1. Platform view: workforce + human + CSOS

```mermaid
flowchart LR
    U[Human User / Athletics Staff] --> UI[athletics-ai-workforce Web App]
    UI --> ORG[Organization Profile + Membership + Roles]
    UI --> KB[Knowledge Brain]
    UI --> TASKS[Tasks + Approvals]
    UI --> VOICE[Voice Command Layer]

    ORG --> AGENTS[Agent Team]
    KB --> AGENTS
    TASKS --> AGENTS
    VOICE --> AGENTS

    AGENTS --> CONNECTOR[Connector Service Layer]
    CONNECTOR --> CSOS[College Sports Operating System]

    CSOS --> CONNECTOR
    CONNECTOR --> RUNS[connector_runs + workflow/task records]
    RUNS --> UI
```

---

## 2. Agent team map

```mermaid
flowchart TD
    COS[Chief of Staff Agent]
    EA[Executive Assistant Agent]
    SI[Sponsorship Intelligence Agent]
    PO[Proposal / Outreach Agent]
    CC[Compliance & Coordination Agent]

    COS --> EA
    COS --> SI
    COS --> PO
    COS --> CC

    EA --> BRIEF[Daily Briefings / Summaries / Scheduling]
    SI --> INTEL[Sponsor Attrition / Category Gaps / Alumni Match]
    PO --> PROPOSALS[Proposal Drafting / Outreach Sequence]
    CC --> GOV[Approvals / Workflow Control / Documentation]
```

---

## 3. Current system behavior

```mermaid
flowchart LR
    USER[User in web app] --> AUTH[Supabase Auth]
    AUTH --> MEMBERSHIP[organization_members]
    MEMBERSHIP --> APP[Authorized App Experience]

    APP --> ORGFORM[Org Setup]
    APP --> KNOWLEDGEFORM[Knowledge Ingestion]
    APP --> DASH[Dashboard / Workers / Tasks / Approvals / Knowledge]

    ORGFORM --> API1[/api/org-profile/]
    KNOWLEDGEFORM --> API2[/api/knowledge-items/]

    API1 --> SERVER[Server-side Supabase client]
    API2 --> SERVER
    DASH --> SERVER

    SERVER --> DB[(Supabase Database)]
    DB --> DASH
```

### What is live now
- Supabase-backed production app
- server-side write path for org profile + knowledge items
- live reads on dashboard/workers/tasks/approvals/knowledge surfaces
- Playwright smoke coverage + safe submit coverage
- auth scaffold + membership bootstrap path
- first connector run API path scaffolded

---

## 4. First authenticated tenant flow

```mermaid
sequenceDiagram
    participant User
    participant App as Web App
    participant Auth as Supabase Auth
    participant DB as Supabase DB

    User->>App: Request magic link
    App->>Auth: signInWithOtp(email)
    Auth-->>User: Magic link
    User->>App: Complete sign-in
    App->>Auth: Establish session
    App->>DB: Lookup organization_members by user_id
    alt No membership yet
        User->>App: Claim demo organization
        App->>DB: Upsert organization_members(owner)
    end
    DB-->>App: Membership context
    App-->>User: Authorized tenant-aware experience
```

---

## 5. First CSOS connector run path

```mermaid
sequenceDiagram
    participant User
    participant Voice as Voice / Action UI
    participant App as Connector API Route
    participant DB as Supabase DB
    participant CSOS as CSOS CLI or Future Adapter

    User->>Voice: Run sponsor attrition analysis
    Voice->>App: POST /api/connector/sponsor-attrition
    App->>DB: Verify signed-in user has org membership
    App->>CSOS: csos sponsor attrition --json
    alt CLI available
        CSOS-->>App: JSON attrition results
    else CLI unavailable
        App-->>App: Use stub connector output
    end
    App->>DB: Insert connector_runs row
    App->>DB: Insert follow-up review task
    App-->>Voice: Success + summary
    DB-->>User: Connector run + task visible in app
```

---

## 6. Future closed-loop athletics workflow

```mermaid
flowchart TD
    V[Voice command or dashboard action] --> SI[Sponsorship Intelligence Agent]
    SI --> C1[CSOS sponsor attrition]
    C1 --> C2[CSOS sponsor category gaps]
    C2 --> C3[CSOS sponsor match alumni]

    C3 --> COS[Chief of Staff Agent]
    COS --> DECIDE[Prioritize opportunities]
    DECIDE --> PO[Proposal / Outreach Agent]
    PO --> P1[CSOS proposal create]
    P1 --> CC[Compliance & Coordination Agent]
    CC --> APPROVAL[Human approval gate]
    APPROVAL -->|approved| SUBMIT[CSOS proposal submit / outreach workflow]
    APPROVAL -->|changes needed| PO

    SUBMIT --> EA[Executive Assistant Agent]
    EA --> BRIEF[Leadership briefing / next actions]
    BRIEF --> HUMAN[Human decision-maker]
```

---

## 7. North-star engagement model with CSOS

```mermaid
flowchart LR
    AAW[athletics-ai-workforce]
    AAW --> GOVERNANCE[Roles / Approvals / Auditability]
    AAW --> KNOWLEDGE[Org Brain + Worker Memory]
    AAW --> TEAM[Agent Team UX]
    AAW --> VOICE[Voice Command Routing]

    TEAM --> CONNECTOR[Connector Service]
    VOICE --> CONNECTOR
    KNOWLEDGE --> CONNECTOR
    GOVERNANCE --> CONNECTOR

    CONNECTOR --> CSOS[College Sports Operating System]
    CSOS --> DOMAIN[Sports-domain execution + records + workflows]
    DOMAIN --> CONNECTOR
    CONNECTOR --> AAW
```

## Interpretation
- **athletics-ai-workforce** is the orchestration layer
- **CSOS** is the athletics execution layer
- **agents** are the operational workforce
- **voice** becomes an input layer, not a separate product silo
- **humans** remain in the loop for approvals, prioritization, and governance

---

## 8. Simplest product story

```mermaid
flowchart LR
    USER[AD / Staff / Operator] --> ASK[Ask workforce for action]
    ASK --> AGENT[Correct agent takes ownership]
    AGENT --> CSOSWORK[CSOS work executed safely]
    CSOSWORK --> LOG[Task + connector run + audit trail logged]
    LOG --> REVIEW[Human reviews / approves / directs next step]
    REVIEW --> OUTCOME[Better athletics operations]
```

This is the product in one sentence:

**A human-led AI workforce that understands the athletics organization, routes work to specialized agents, executes domain actions through CSOS safely, and keeps everything auditable.**
