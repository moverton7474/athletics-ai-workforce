# Phase 2.3 Implementation Plan

## Objective
Turn proposal-oriented connector outputs into governed, reviewable workflows with explicit approval state, dedicated review UI, and downstream orchestration hooks.

## Scope for this implementation pass
1. **Structured approval records**
   - enrich approval rows with explicit workflow metadata
   - normalize proposal-review fields so UI and downstream automation do not rely only on ad hoc JSON parsing
   - keep compatibility with existing `details` JSON payloads

2. **Approval actions / endpoints**
   - keep approve / reject / request-changes actions
   - prevent duplicate decisions on already-decided approvals
   - persist richer follow-up workflow state
   - attach downstream follow-up task ids to the originating approval record

3. **Approval review UI**
   - keep approvals list page
   - add approval detail page for full review context
   - show workflow metadata, connector context, and connector output payloads in a dedicated review surface
   - preserve in-place decision controls

## Data model changes
Add a follow-on migration that enriches `approvals` with:
- `requested_action`
- `target_system`
- `entity_type`
- `entity_name`
- `stage`
- `next_action_label`
- `outcome_task_id`

These fields make approvals queryable for dashboarding, routing, and future integrations.

## App changes
### Connector layer
- centralize approval metadata creation for proposal-review workflows
- keep current connector run → task → approval orchestration
- persist enriched workflow metadata into structured approval columns and `details`

### Decision layer
- validate approval is still pending before acting
- update connector run + origin task status
- create downstream task for approved / rejected / changes-requested paths
- store `outcome_task_id` on the approval row

### Review UI
- approvals list remains queue-oriented
- approval detail page becomes the operator review surface
- include:
  - title / summary / status
  - company / entity / stage / system / action
  - review notes
  - raw connector output payload
  - decision controls

## Verification target
- existing authenticated Playwright approval path should still pass
- next extension should validate approval detail review path and at least one alternate decision branch (`changes_requested`)

## Next architecture step after this pass
Once this pass is merged, the next design task is the **custom integration gateway**:
- a dedicated internal API/service layer for institution system connectors
- adapters for CRM systems (Salesforce), ticketing/donor systems (Paciolan), and financial systems (e.g. Blackbaud)
- normalized ingest + entity-mapping + action audit model

## Known blocker for the next review task
End-to-end review of the actual KSU CSOS codebase still requires the codebase to be available in this workspace (repo, archive, or mounted path). Without that, architecture guidance can be produced, but code-level integration recommendations remain provisional.
