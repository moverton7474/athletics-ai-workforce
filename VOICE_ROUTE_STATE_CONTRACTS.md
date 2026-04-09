# VOICE_ROUTE_STATE_CONTRACTS.md

## Purpose
Define the next planning layer for the athletics-ai-workforce voice-complete MVP without prematurely building the voice runtime.

This spec makes four things explicit:
1. the route inventory for the first voice-complete workflow shell
2. the typed state contracts that move between those routes
3. the voice-command → route/state mapping for the first workflows
4. the manual fallback behavior when voice is unavailable, incomplete, or declined

## Core Product Rule
Voice is an entry path into the same governed shell manual users already use.

That means:
- voice and manual navigation should land on the same routes
- voice and manual execution should use the same underlying actions
- voice may answer, navigate, and prefill
- human approval remains mandatory for meaningful execution
- route state must survive cleanly without depending on an active voice session

---

## Route Inventory Table

| Route | Purpose | Entry Modes | Required State | Recoverable Without Prefill? | Notes |
| --- | --- | --- | --- | --- | --- |
| `/segments` | Segment discovery landing page for saved and ad hoc cohorts | manual, voice-navigate | optional `SegmentQueryState` | yes | Default home for non-renewals, hot leads, donor leads, future cohorts |
| `/segments/[segmentKey]` | Segment detail / filtered list page | manual, voice-answer+navigate | `SegmentContext` or deterministic filter params | yes | Must support durable URL/query recovery even if transient state is lost |
| `/campaigns/new` | Blank campaign builder | manual | optional `CampaignBuilderState` | yes | Manual-first entry when no segment handoff exists |
| `/campaigns/new/from-segment` | Prefilled campaign builder launched from a segment | manual, voice-answer+navigate+prefill | `CampaignBuilderState` with linked `SegmentContext` | partial | If prefill is stale, route should degrade to builder with visible missing-field prompts |
| `/campaigns/drafts/[draftId]` | Existing campaign draft detail/edit view | manual, voice-navigate | `CampaignBuilderState` reference by `draftId` | yes | Source of truth should be persisted draft, not transient voice memory |
| `/campaigns/drafts/[draftId]/review` | Generated asset review by channel | manual, voice-navigate | `GeneratedAssetReviewState` | yes | Review surface for email, SMS, voice call, personalized video assets |
| `/approvals` | Approval inbox / queue | manual, voice-answer+navigate | optional `ApprovalQueueState` | yes | Should support filtered approval subsets |
| `/approvals/[approvalId]` | Approval decision page for launch-critical actions | manual, voice-navigate | `ApprovalDecisionState` | yes | Final approval authority remains human-controlled |
| `/campaigns/[campaignId]/results` | Campaign results and follow-up overview | manual, voice-answer+navigate | `CampaignFollowUpState` | yes | Should show performance, scheduled follow-ups, and recommendations |
| `/campaigns/[campaignId]/follow-up` | Recommended next action after campaign run | manual, voice-navigate | `CampaignFollowUpState` | partial | Can prefill next-campaign recommendation flow |
| `/dashboard` | Top-level operator command center | manual, voice-answer+navigate | optional `NavigationIntentState` | yes | Used for “what should I work on next?” style guidance |

### Route contract rules
- Every route must support direct manual access even when no voice session exists.
- Every route must be reconstructable from durable IDs or deterministic filters where possible.
- Prefill-heavy routes must visibly distinguish persisted values from transient suggestions.
- Approval routes must always be recoverable from queue/history navigation, not only from one conversational hop.
- Segment routes should prefer bookmarkable query params for filter logic and use transient state only for convenience metadata.

---

## State Contract Spec

The interfaces below are planning contracts. They are intentionally implementation-ready enough to guide actual app types later.

```ts
export type EntryMode = 'manual' | 'voice' | 'workflow' | 'system';

export type VoiceActionMode =
  | 'answer_only'
  | 'answer_and_navigate'
  | 'answer_navigate_prefill'
  | 'answer_navigate_pending_approval';

export type ChannelType = 'email' | 'sms' | 'voice_call' | 'personalized_video';

export type SegmentSourceType =
  | 'saved_segment'
  | 'deterministic_filter'
  | 'connector_result'
  | 'csos_query'
  | 'manual_list';

export interface RoutePrefillMeta {
  entryMode: EntryMode;
  voiceActionMode?: VoiceActionMode;
  initiatedAt: string;
  initiatedByUserId?: string;
  sourceCommand?: string;
  sourceWorker?:
    | 'chief_of_staff'
    | 'executive_assistant'
    | 'sponsorship_intelligence'
    | 'proposal_outreach'
    | 'compliance_coordination';
  confidence?: 'high' | 'medium' | 'low';
  staleAfterIso?: string;
}

export interface SegmentFilterDefinition {
  sport?: string;
  season?: string;
  ticketProduct?: string;
  segmentKind?:
    | 'non_renewals'
    | 'hot_leads'
    | 'donor_leads'
    | 'sponsor_attrition'
    | 'custom';
  queryText?: string;
  ownerIds?: string[];
  status?: string[];
  tags?: string[];
  limit?: number;
  sort?: 'priority_desc' | 'revenue_desc' | 'recent_desc';
}

export interface SegmentContext {
  segmentKey: string;
  sourceType: SegmentSourceType;
  label: string;
  summary: string;
  rationale?: string;
  audienceCount?: number;
  estimatedValue?: number;
  filterDefinition: SegmentFilterDefinition;
  sourceRecordIds?: string[];
  recommendedObjective?: string;
  nextBestAction?: string;
  recoverableUrl: string;
  prefillMeta: RoutePrefillMeta;
}

export interface SegmentQueryState {
  searchText?: string;
  suggestedQueries?: string[];
  activeFilters?: SegmentFilterDefinition;
  selectedSegmentKey?: string;
  prefillMeta: RoutePrefillMeta;
}

export interface CampaignChannelConfig {
  channel: ChannelType;
  enabled: boolean;
  objective?: string;
  audienceNotes?: string;
  assetCountTarget?: number;
}

export interface CampaignBuilderState {
  draftId?: string;
  campaignId?: string;
  linkedSegment: SegmentContext;
  campaignName?: string;
  campaignObjective: string;
  businessContext: {
    organizationId?: string;
    sport?: string;
    season?: string;
    department?: string;
  };
  selectedChannels: CampaignChannelConfig[];
  operatorNotes?: string;
  prefilledFields: string[];
  operatorOverrides: string[];
  missingRequiredFields: string[];
  approvalRequired: boolean;
  reviewRoute: string;
  prefillMeta: RoutePrefillMeta;
}

export interface GeneratedAsset {
  assetId: string;
  channel: ChannelType;
  title: string;
  bodyPreview: string;
  status: 'draft' | 'ready_for_review' | 'changes_requested' | 'approved' | 'rejected';
  changeRequestNote?: string;
}

export interface GeneratedAssetReviewState {
  draftId: string;
  linkedSegment: SegmentContext;
  assets: GeneratedAsset[];
  reviewSummary?: string;
  pendingChannels: ChannelType[];
  approvedChannels: ChannelType[];
  rejectedChannels: ChannelType[];
  requestChangesAllowed: boolean;
  nextApprovalRoute?: string;
  prefillMeta: RoutePrefillMeta;
}

export interface ApprovalDependency {
  dependencyType: 'campaign_launch' | 'channel_asset' | 'schedule' | 'external_send';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  label: string;
}

export interface ApprovalDecisionState {
  approvalId: string;
  approvalType: 'campaign_launch' | 'campaign_assets' | 'campaign_schedule' | 'proposal_review';
  title: string;
  summary: string;
  campaignId?: string;
  draftId?: string;
  linkedSegment?: SegmentContext;
  dependencies: ApprovalDependency[];
  blockedActions: string[];
  availableDecisions: Array<'approve' | 'request_changes' | 'reject'>;
  decisionNoteRequired: boolean;
  postDecisionRoute?: string;
  prefillMeta: RoutePrefillMeta;
}

export interface CampaignFollowUpState {
  campaignId: string;
  campaignName: string;
  resultStatus: 'scheduled' | 'running' | 'completed' | 'underperforming' | 'archived';
  performanceSummary?: string;
  channelResults: Array<{
    channel: ChannelType;
    summary: string;
    status: 'scheduled' | 'sent' | 'completed' | 'underperforming';
  }>;
  scheduledNotifications: Array<{
    notificationId: string;
    label: string;
    scheduledForIso: string;
    status: 'scheduled' | 'sent' | 'dismissed';
  }>;
  recommendedNextCampaign?: {
    reason: string;
    suggestedSegmentKey?: string;
    suggestedObjective?: string;
    launchRoute?: string;
  };
  prefillMeta: RoutePrefillMeta;
}

export interface ApprovalQueueState {
  filter?: 'all' | 'pending' | 'launch_ready' | 'changes_requested';
  highlightedApprovalId?: string;
  prefillMeta: RoutePrefillMeta;
}

export interface NavigationIntentState {
  targetRoute: string;
  reason: string;
  highlightedEntityId?: string;
  prefillMeta: RoutePrefillMeta;
}
```

### State contract rules
- Every major handoff object must be serializable enough to persist or reconstruct.
- `SegmentContext` is the key bridge object across query, builder, review, approval, and follow-up.
- Voice may supply `prefillMeta`, but the UI must remain valid if voice metadata is absent.
- `operatorOverrides` must always win over prefilled values.
- Approval state must reference blocked actions explicitly so the UI can explain why execution is paused.
- Follow-up state must support recommendations without auto-launching a new campaign.

---

## Voice-Command → Route/State Mapping Table

| Workflow | Example Voice Command | Voice Response Mode | Route Opened | Primary State Object | Approval Gate | Expected Result |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Query 2026 KSU football non-renewals | “Show me 2026 KSU football non-renewals.” | answer_and_navigate | `/segments/[segmentKey]` | `SegmentContext` | none for query | Return count/summary and immediately open the matching filtered list |
| 1a. Build campaign from non-renewals | “Build a KSU Football Season Ticket Sales Campaign for this group.” | answer_navigate_prefill | `/campaigns/new/from-segment` | `CampaignBuilderState` | yes, later at review/launch | Open prefilled builder using the active non-renewals segment |
| 2. Build KSU Football Season Ticket Sales Campaign | “Build a KSU Football Season Ticket Sales Campaign.” | answer_navigate_prefill | `/campaigns/new/from-segment` if segment exists, otherwise `/segments` first | `CampaignBuilderState` or `SegmentQueryState` | yes | If a segment is active, jump to builder; otherwise route user to segment discovery to choose audience first |
| 2a. Review generated assets | “Review the generated campaign assets.” | answer_and_navigate | `/campaigns/drafts/[draftId]/review` | `GeneratedAssetReviewState` | yes before launch | Open grouped asset review by channel |
| 2b. Approve launch | “Approve this campaign and schedule it.” | answer_navigate_pending_approval | `/approvals/[approvalId]` | `ApprovalDecisionState` | yes, this is the gate | Open approval decision screen instead of silently scheduling |
| 3. Show hot leads / donor leads | “Show me hot leads.” / “Show donor leads.” | answer_and_navigate | `/segments/[segmentKey]` | `SegmentContext` | none for query | Return summary and open the matching filtered segment list |
| 3a. Build campaign from hot leads | “Build a campaign for these hot leads.” | answer_navigate_prefill | `/campaigns/new/from-segment` | `CampaignBuilderState` | yes, later at review/launch | Prefill builder using the hot leads segment context |
| 4. Open pending approvals | “Show pending approvals.” | answer_and_navigate | `/approvals` | `ApprovalQueueState` | queue only | Open approval inbox filtered to pending actions |
| 5. Show campaign results | “How did that campaign perform?” | answer_and_navigate | `/campaigns/[campaignId]/results` | `CampaignFollowUpState` | none for results | Show results summary, scheduled follow-ups, and recommendation if underperforming |

### Mapping rules
- If the user references “this segment,” the active `SegmentContext` must be reused if it is still valid.
- If no active segment exists for a campaign-building command, the system should route to segment discovery instead of guessing.
- Voice-triggered scheduling must resolve through approval routes, never direct background execution.
- The voice layer should narrate what route it opened and what still requires human action.

---

## Manual Fallback Behavior

### Workflow 1: Query 2026 KSU football non-renewals
**Voice path**
- answer with live summary
- navigate to `/segments/[segmentKey]`
- preserve a `SegmentContext` for downstream campaign building

**Manual fallback**
- operator opens `/segments`
- selects saved segment or applies deterministic filters:
  - sport = football
  - season = 2026
  - segment kind = non-renewals
- system builds the same `SegmentContext`
- user can then click “Build campaign from segment” to open `/campaigns/new/from-segment`

**If state is incomplete**
- open `/segments` with the partial filters populated
- show which filters still need confirmation
- do not create a campaign draft yet

### Workflow 2: Build KSU Football Season Ticket Sales Campaign
**Voice path**
- reuse current `SegmentContext` if present
- open `/campaigns/new/from-segment`
- prefill objective, sport, and suggested channels
- let operator edit channel mix, notes, and builder fields
- generate assets into `/campaigns/drafts/[draftId]/review`
- route launch/scheduling into `/approvals/[approvalId]`

**Manual fallback**
- operator opens segment detail page first or opens `/campaigns/new`
- chooses a saved segment or filter source manually
- fills campaign objective and channel selection directly
- clicks generate to create draft review state
- reviews assets and submits approval request manually

**If state is incomplete**
- if no segment exists, redirect to `/segments`
- if segment exists but objective/channel info is missing, remain in builder with missing fields highlighted
- if assets are not generated yet, stay on builder rather than jumping to review
- if approval object does not exist yet, review route should expose “Submit for approval” rather than pretending scheduling is available

### Workflow 3: Show hot leads / donor leads
**Voice path**
- answer with summary of hot leads or donor leads
- navigate to `/segments/[segmentKey]`
- preserve segment context for follow-on actions such as campaign creation or assigning outreach work

**Manual fallback**
- operator opens `/segments`
- clicks saved “Hot Leads” or “Donor Leads” segment, or applies equivalent filters
- optionally launches a campaign builder or creates a task from the same segment

**If state is incomplete**
- default to `/segments` with best-available query text
- ask the operator to choose between hot leads and donor leads if the phrase is ambiguous
- keep the route valid even if no live result count is available yet

---

## UX / Product Guardrails
- The UI should always show whether the current page was opened manually or from a voice-prefilled action.
- The UI should visibly mark fields that were prefilled by the system and fields edited by the operator.
- Approval gates must be explicit on-screen before launch, scheduling, or external send actions.
- Voice should never hide the review surface for generated campaign assets.
- Query flows should answer first and navigate immediately when confidence is high, matching the CSOS interaction pattern Milton approved.

## Implementation Guidance For The Next Build Slice
1. Add the route inventory and state object references into the relevant shell docs/routes.
2. Create shared TypeScript types from the contracts above before wiring voice runtime behavior.
3. Ensure segment detail and campaign builder routes can reconstruct state from durable params or persisted draft IDs.
4. Keep voice work in planning mode until the manual shell fully supports the route/state path end to end.

## Practical Summary
The first voice-complete MVP should not start with speech plumbing.
It should start with a shell that already knows:
- where to navigate
- what state to carry
- what review step comes next
- where approval is required
- how the same flow works manually if voice is unavailable
