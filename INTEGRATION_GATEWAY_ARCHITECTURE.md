# Integration Gateway Architecture Recommendation

## Status
This is a **provisional architecture recommendation** based on the athletics-ai-workforce product state and Milton's stated integration goals.

It is **not yet a code-level review of the KSU CSOS codebase** because that codebase is not currently present in this workspace.

## Recommendation
Do **not** connect athletics-ai-workforce directly to every institutional system from the web app.

Instead, create a **custom integration gateway** that sits between:
- athletics-ai-workforce (workflow/orchestration/governance layer)
- KSU CSOS / institutional systems (execution + source systems)

## Why this is the right path
### 1. Governance
The workforce app needs approvals, role checks, audit logs, and workflow state before sensitive actions happen.

### 2. Connector isolation
Salesforce, Paciolan, Blackbaud, and custom institutional systems all have different auth models, rate limits, payload shapes, and operational risks.

### 3. Reusability
A normalized gateway lets the same workforce product serve many institutions without baking institution-specific logic into the UI app.

### 4. Future agent orchestration
Agents should request actions through a governed command layer, not hold raw direct system credentials.

## Proposed split of responsibilities
### athletics-ai-workforce
- org onboarding
- membership / roles
- approvals
- workflow orchestration
- dashboard / task surfaces
- worker UX
- audit-friendly human review

### custom integration gateway
- connector credential isolation
- institution-specific mappings
- inbound data ingest jobs
- outbound action execution
- normalized result objects
- retries / rate limiting / error handling
- entity linking across systems

### institutional systems / backend targets
- KSU CSOS
- Salesforce CRM
- Paciolan / ticketing / donor systems
- Blackbaud / finance / budget systems
- future ERP / advancement / NIL / recruiting systems

## Recommended gateway shape
### Core services
1. **Connector registry**
   - list of supported systems
   - auth method per connector
   - capability discovery

2. **Account connection manager**
   - per-institution connection records
   - OAuth/token refresh where needed
   - secret references, not raw secrets in app tables

3. **Ingest pipeline**
   - scheduled pulls / webhook receivers
   - normalized records into common entity model

4. **Action execution layer**
   - proposal submit
   - CRM task creation
   - ticketing/account sync
   - reporting jobs

5. **Entity resolution / mapping layer**
   - institution
   - sponsor/account
   - contact
   - alum
   - opportunity
   - proposal
   - campaign
   - budget item

6. **Audit + run log layer**
   - every action request logged
   - request/response snapshots
   - human approval references
   - retry / failure metadata

## Suggested API model
### Command-style internal API
Use a normalized internal contract like:

- `POST /v1/action-runs`
- `POST /v1/ingest-jobs`
- `GET /v1/entity-links/:id`
- `POST /v1/connections`
- `POST /v1/webhooks/:provider`

### Example action payload
```json
{
  "organizationId": "org-uuid",
  "workflowId": "workflow-uuid",
  "approvalId": "approval-uuid",
  "connector": "salesforce",
  "action": "opportunity.upsert",
  "entity": {
    "type": "proposal",
    "name": "Acme Roofing"
  },
  "input": {
    "company": "Acme Roofing",
    "requestedValue": 25000
  }
}
```

### Example response shape
```json
{
  "runId": "run-uuid",
  "status": "success",
  "connector": "salesforce",
  "action": "opportunity.upsert",
  "output": {
    "remoteId": "006xxxx",
    "summary": "Opportunity upserted successfully"
  },
  "audit": {
    "approvedBy": "user-uuid",
    "approvedAt": "2026-04-08T00:00:00Z"
  }
}
```

## Data model recommendation for integrations
Add or formalize the following shared tables later:
- `integration_accounts`
- `integration_connections`
- `integration_capabilities`
- `integration_action_runs`
- `integration_ingest_jobs`
- `entity_links`
- `external_records`
- `integration_webhook_events`

## Recommended rollout order
### Phase A
KSU CSOS custom adapter only
- action-run contract
- normalized run logs
- proposal + sponsorship operations

### Phase B
Inbound data ingest foundation
- sponsor/account ingest
- contact/alumni ingest
- proposal/opportunity ingest
- entity-link resolution

### Phase C
Institutional connector pack
- Salesforce
- Paciolan
- Blackbaud
- role-aware approvals for outbound actions

### Phase D
Institution-specific mapping UI
- field mapping
- sync controls
- credential status
- connection health dashboard

## Immediate next design questions
To make the real integration recommendation precise, we still need to know:
1. Is KSU CSOS already exposing an internal API, or only direct app/backend logic?
2. What language/runtime is the CSOS backend?
3. Where should the custom gateway live: same repo, sibling repo, or separate service?
4. Which system is source-of-truth for:
   - sponsors/accounts
   - contacts
   - proposals
   - ticketing / donor activity
   - budgets / financials
5. Which actions must always require human approval before execution?

## Short conclusion
**Best path:** build your own **custom integration gateway API** and let athletics-ai-workforce call that gateway, not the institutional systems directly.

That gives you:
- safer approvals
- cleaner connector logic
- reusable institution integrations
- normalized ingest/action workflows
- better long-term productization
