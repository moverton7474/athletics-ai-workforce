# CSOS_ADAPTER_SPEC.md

## Objective
Define the first stable integration contract between `athletics-ai-workforce` and `GF-Accelerate/ksu-csos`.

## Integration Principle
`athletics-ai-workforce` should not couple directly to current CSOS frontend service contracts.

Instead it should talk to a **CSOS adapter/gateway** that:
- authenticates server-side
- normalizes payloads
- reads stable data models directly where appropriate
- calls a narrow set of vetted CSOS Edge Functions for workflow mutations

## Responsibility Split
### athletics-ai-workforce owns
- approvals
- tasks
- workflow orchestration
- role-aware human review
- audit trail for cross-system actions
- multi-institution productization

### CSOS adapter owns
- CSOS auth/session handling
- payload normalization
- institution/system-specific mappings
- function invocation
- stable read-model access
- retries / sync observability
- downstream connector bridging to Salesforce / Paciolan / Blackbaud later

## Phase 1 Scope
Implement the first adapter around these use cases:
1. sponsorship pipeline read
2. proposal generation
3. proposal approval
4. proposal send/submit
5. dashboard/reporting read
6. Salesforce sync status/run visibility

## Recommended Adapter Endpoints
### Reads
- `GET /v1/csos/sponsorship/pipeline`
- `GET /v1/csos/sponsorship/proposals`
- `GET /v1/csos/reporting/dashboard`
- `GET /v1/csos/sync/salesforce/status`
- `GET /v1/csos/constituents/search?q=`

### Workflow / Mutations
- `POST /v1/csos/proposals/generate`
- `POST /v1/csos/proposals/approve`
- `POST /v1/csos/proposals/send`
- `POST /v1/csos/routing/resolve`
- `POST /v1/csos/identity/resolve`
- `POST /v1/csos/sync/salesforce/run`

## Call Function vs Read Table Matrix
### Call CSOS Edge Functions
Use function invocation for workflow logic already encapsulated in CSOS:
- `proposal_generate`
- `proposal_approve`
- `proposal_send`
- `routing_engine`
- `identity_resolve`
- `salesforce_sync`
- `dashboard_data` (if aggregation logic is required)

### Read CSOS Supabase Tables Directly
Use direct reads for stable domain/reporting models:
- `corporate_sponsorship`
- `sponsorship_pipeline`
- `outreach_sequence`
- `sponsor_proposal`
- `proposal_generated`
- `proposal_template`
- `brand_config`
- reporting/materialized view layer
- integration health/status tables where read-only

### Avoid Direct Writes Initially
Do not write directly to operational CSOS tables from athletics-ai-workforce in Phase 1 unless the write path is explicitly normalized and reviewed.

## Auth Model
### User-initiated actions
- initiated in athletics-ai-workforce
- approved according to workforce roles
- executed server-side by the adapter

### Adapter-to-CSOS auth
- service-backed credentials on the server only
- no raw CSOS credentials exposed in browser clients
- preserve initiating user context in audit metadata

## Canonical Payload Shapes
### Generate proposal
```json
{
  "organizationId": "org-uuid",
  "approvalId": "approval-uuid",
  "entity": {
    "type": "proposal",
    "name": "Acme Roofing"
  },
  "input": {
    "opportunityId": "optional-csos-id",
    "templateType": "corporate_sponsorship",
    "brandProfileId": "optional-brand-id"
  },
  "requestedBy": {
    "userId": "user-uuid",
    "role": "operator"
  }
}
```

### Approve proposal
```json
{
  "organizationId": "org-uuid",
  "approvalId": "approval-uuid",
  "proposalId": "csos-proposal-id",
  "action": "approve",
  "decisionNote": "Looks good. Move to submission prep.",
  "requestedBy": {
    "userId": "user-uuid",
    "role": "admin"
  }
}
```

### Send proposal
```json
{
  "organizationId": "org-uuid",
  "approvalId": "approval-uuid",
  "proposalId": "csos-proposal-id",
  "channel": "email",
  "requestedBy": {
    "userId": "user-uuid",
    "role": "operator"
  }
}
```

## Response Shape
```json
{
  "ok": true,
  "runId": "adapter-run-uuid",
  "source": "csos",
  "action": "proposals.generate",
  "status": "success",
  "summary": "Proposal generated successfully",
  "output": {},
  "audit": {
    "initiatedByUserId": "user-uuid",
    "approvalId": "approval-uuid"
  }
}
```

## Athletics-AI-Workforce Mapping
### approval types
- `proposal_review`
- future: `proposal_send`, `crm_sync`, `budget_sync`

### requested actions
- `proposal_generate`
- `proposal_approve`
- `proposal_send`
- `salesforce_sync`
- future: `paciolan_sync`, `blackbaud_sync`

### workflow states
- `draft_review`
- `submission_prep`
- `submitted`
- `revision_requested`
- `closed_rejected`

## Near-Term Implementation Plan
1. finalize this adapter spec
2. update roadmap to reflect adapter-first CSOS integration
3. add a lightweight adapter module/server contract in athletics-ai-workforce
4. wire proposal review workflow to adapter-oriented action metadata
5. only after that begin first live CSOS read path integration

## Future Connector Expansion
The adapter/gateway should become the integration backbone for institution systems such as:
- Salesforce
- Paciolan
- Blackbaud
- future CRM / ticketing / finance / donor systems

## Key Rule
Treat CSOS as a powerful backend system, but do not let athletics-ai-workforce depend directly on unstable frontend service contracts. Normalize everything through the adapter.
