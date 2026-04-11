# Athletics AI Workforce ↔ KSU CSOS Handshake Spec

## Purpose
Define the first stable integration contract between `athletics-ai-workforce` and `KSU CSOS`.

This contract is designed so that:
- athletics-ai-workforce remains the governed operator shell
- KSU CSOS remains the athletics-domain backend
- both systems can evolve internally without breaking the other

This is an MVP-first spec.
It prioritizes a narrow, stable, auditable bridge over broad integration coverage.

---

## Architectural Rule
athletics-ai-workforce should call **named CSOS capabilities** through a server-side adapter.

It should **not** initially depend on:
- CSOS frontend service contracts
- CSOS voice runtime as the primary handshake layer
- raw agent-to-agent freeform conversation
- direct browser-side access to CSOS credentials

---

## Responsibility Split
### athletics-ai-workforce owns
- operator shell
- workflow orchestration
- tasks
- approvals
- memory and continuity
- cross-system audit framing
- user-facing campaign workflow UX

### KSU CSOS owns
- athletics-domain query logic
- ticketing/donor source-of-truth data
- pipeline logic
- segmentation logic
- campaign execution backends
- internal voice/agent/orchestrator routing if needed

---

## Integration Modes
### 1. Read mode
Use for:
- prospect queries
- renewal risk lists
- constituent search
- profile lookup
- pipeline summary

Characteristics:
- synchronous when practical
- returns structured data directly
- no approval required by default
- still carries audit metadata

### 2. Draft mode
Use for:
- compose outreach draft
- preview campaign content
- generate execution-ready payloads

Characteristics:
- may require approval context depending on organization rule
- returns a draft/preview, not execution confirmation
- suitable for human review inside athletics-ai-workforce

### 3. Execute mode
Use for:
- schedule outreach
- send outreach
- activate campaign
- move stage

Characteristics:
- approval-aware
- strongly audited
- should support async response / run tracking
- not part of the first bridge unless explicitly needed

---

## Canonical Request Envelope
```json
{
  "requestId": "uuid",
  "organizationId": "org-uuid",
  "sourceSystem": "athletics-ai-workforce",
  "targetSystem": "ksu-csos",
  "capability": "ticketing.prospects.segment",
  "mode": "read",
  "approvalId": "optional-approval-uuid",
  "taskId": "optional-task-uuid",
  "requestedBy": {
    "userId": "user-uuid",
    "role": "operator"
  },
  "context": {
    "workflowType": "ticket_sales",
    "segmentKey": "optional-segment-key",
    "campaignId": "optional-campaign-id",
    "draftId": "optional-draft-id",
    "notes": "optional context for downstream handling"
  },
  "input": {}
}
```

---

## Canonical Response Envelope
```json
{
  "ok": true,
  "requestId": "uuid",
  "runId": "uuid-or-null",
  "source": "ksu-csos",
  "capability": "ticketing.prospects.segment",
  "mode": "read",
  "status": "success",
  "summary": "Returned 100 football prospects above 70 propensity.",
  "output": {},
  "error": null,
  "audit": {
    "requestedByUserId": "user-uuid",
    "approvalId": "optional-approval-uuid",
    "taskId": "optional-task-uuid",
    "processedAt": "2026-04-11T17:00:00.000Z"
  }
}
```

---

## Status Values
Use these normalized status values across all bridge responses:
- `success`
- `queued`
- `partial`
- `error`
- `requires_approval`
- `not_found`

---

## First Capability Set

### 1. `ticketing.prospects.segment`
**Mode:** `read`

#### Request input
```json
{
  "sport": "football",
  "minPropensity": 70,
  "maxPropensity": 100,
  "isTicketHolder": false,
  "hasPaciolan": true,
  "stage": "single_game",
  "limit": 100
}
```

#### Response output
```json
{
  "cohort": {
    "label": "Top Football Prospects",
    "summary": "High-propensity football prospects from CSOS.",
    "audienceCount": 100,
    "estimatedValue": null,
    "sourceType": "csos_query"
  },
  "prospects": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "555-0101",
      "sportAffinity": "football",
      "isTicketHolder": false,
      "lifetimeTicketSpend": 0,
      "propensity": 84,
      "recommendation": "High propensity - prioritize for immediate outreach"
    }
  ]
}
```

---

### 2. `ticketing.renewal_risk.list`
**Mode:** `read`

#### Request input
```json
{
  "sport": "football",
  "riskLevel": "high",
  "limit": 100
}
```

#### Response output
```json
{
  "cohort": {
    "label": "Football Renewal Risk",
    "summary": "High-risk football constituents likely to churn.",
    "audienceCount": 100,
    "sourceType": "csos_query"
  },
  "constituents": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "555-0102",
      "renewalRisk": "high",
      "ticketPropensity": 76,
      "lifetimeTicketSpend": 4200
    }
  ]
}
```

---

### 3. `constituents.search`
**Mode:** `read`

#### Request input
```json
{
  "query": "Jane Doe"
}
```

#### Response output
```json
{
  "matches": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "555-0101"
    }
  ]
}
```

---

### 4. `constituents.profile`
**Mode:** `read`

#### Request input
```json
{
  "constituentId": "uuid"
}
```

#### Response output
```json
{
  "constituent": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "555-0101"
  },
  "scores": {
    "renewalRisk": "medium",
    "ticketPropensity": 84
  },
  "summary": "High-value football prospect with strong affinity and no current season package."
}
```

---

## Draft Capability Set

### 5. `ticketing.outreach.compose`
**Mode:** `draft`

#### Request input
```json
{
  "campaignId": "csos-campaign-id",
  "constituentIds": ["uuid-1", "uuid-2"],
  "channel": "email",
  "touchType": "initial_outreach"
}
```

#### Response output
```json
{
  "draft": {
    "channel": "email",
    "subject": "Join us for KSU Football",
    "content": "<html>...</html>"
  }
}
```

### 6. `ticketing.outreach.preview`
**Mode:** `draft`

Use this when athletics-ai-workforce already has campaign parameters and wants a preview from CSOS logic before review/approval.

---

## Controlled Execution Capability Set

### 7. `ticketing.outreach.schedule`
**Mode:** `execute`

### 8. `ticketing.outreach.send`
**Mode:** `execute`

### 9. `ticketing.campaign.create`
**Mode:** `execute`

### 10. `ticketing.campaign.activate`
**Mode:** `execute`

These should be staged after:
- first read bridge succeeds
- approvals are mapped cleanly
- auth and audit are proven

---

## Approval Rules
### Read mode
- generally no approval required
- still logged and auditable

### Draft mode
- approval optional depending on organizational rule
- generated artifacts should still route into athletics-ai-workforce review

### Execute mode
- approval required for consequential actions
- approval should originate in athletics-ai-workforce
- CSOS should receive approval context in the request envelope

---

## Auth Model
### Recommended MVP model
**Server-to-server adapter with service-backed credentials**

Rules:
- athletics-ai-workforce stores bridge credentials server-side only
- browser clients never receive raw CSOS credentials
- initiating user identity is passed as metadata
- CSOS validates allowed capability access per request

### User context propagation
Every request should include:
- `requestedBy.userId`
- `requestedBy.role`
- optional `approvalId`
- optional `taskId`

This preserves cross-system auditability without forcing browser-level direct auth into CSOS.

---

## Audit Requirements
Every bridge request should be traceable to:
- source system
- initiating user
- capability name
- approval context
- task context
- timestamp
- resulting CSOS run/job id if present

athletics-ai-workforce should store:
- connector run / task / approval references
- summary of what was requested
- summary of what returned

KSU CSOS should store:
- request provenance
- execution status
- internal function/action used
- any downstream message/campaign identifiers

---

## Sync vs Async Rules
### Synchronous by default for:
- search
- list
- segment
- profile lookup
- summary queries

### Async preferred for:
- heavy analysis
- multi-record drafting
- schedule/send execution
- campaign activation or bulk operations

Async responses should include:
- `runId`
- `status: queued`
- polling or callback strategy

---

## Error Model
Use normalized bridge errors:
- `invalid_request`
- `unauthorized`
- `forbidden`
- `not_found`
- `approval_required`
- `provider_unavailable`
- `timeout`
- `internal_error`

Suggested error response shape:
```json
{
  "ok": false,
  "requestId": "uuid",
  "runId": null,
  "source": "ksu-csos",
  "capability": "ticketing.prospects.segment",
  "mode": "read",
  "status": "error",
  "summary": "Capability failed.",
  "output": null,
  "error": {
    "code": "provider_unavailable",
    "message": "CSOS ticket pipeline is temporarily unavailable."
  }
}
```

---

## Mapping Back into Athletics AI Workforce
When athletics-ai-workforce receives a successful read response, it should map it into:
- `SegmentContext`
- segment provenance metadata
- recoverable next action into `/campaigns/new/from-segment`
- optional task/memory entries if the workflow warrants it

When athletics-ai-workforce receives a draft response, it should map it into:
- campaign draft artifacts
- review surface content
- approval-ready context

When athletics-ai-workforce receives an execute response, it should map it into:
- approval decision history
- connector run log
- workflow status/timeline update
- follow-up or outcome task creation if needed

---

## Key Rule
The first handshake should be:
- **stable**
- **narrow**
- **auditable**
- **capability-based**

Not:
- broad
- voice-runtime-coupled
- freeform agent chat between systems
- browser-auth-dependent

---

## Recommended First Live Workflow
### Locked first workflow
`KSU Football Non-Renewals`

### Alternative later
`Top Football Season Ticket Prospects`

Both fit this spec cleanly and can be supported by the first read bridge plus the existing athletics campaign workflow shell, with non-renewals now selected as the initial bridge target.
