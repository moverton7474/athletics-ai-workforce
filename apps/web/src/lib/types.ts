export type WorkerMode = 'shared' | 'personal';
export type WorkerStatus = 'active' | 'paused' | 'draft' | 'archived';
export type TaskStatus = 'queued' | 'in_progress' | 'blocked' | 'completed' | 'canceled';
export type WorkerTab = 'chat' | 'outputs' | 'guidelines' | 'settings';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';
export type ConnectorRunStatus =
  | 'queued'
  | 'success'
  | 'failed'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

export interface WorkerDTO {
  id: string;
  organizationId: string;
  name: string;
  roleName: string;
  mode: WorkerMode;
  status: WorkerStatus;
  tabs: WorkerTab[];
}

export interface TaskDTO {
  id: string;
  organizationId: string;
  workerId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ApprovalDTO {
  id: string;
  organizationId: string;
  taskId?: string | null;
  connectorRunId?: string | null;
  outcomeTaskId?: string | null;
  title: string;
  summary?: string;
  status: ApprovalStatus;
  approvalType: string;
  requestedAction?: string;
  targetSystem?: string;
  entityType?: string;
  entityName?: string;
  stage?: string;
  nextActionLabel?: string;
  decisionNote?: string | null;
  details?: Record<string, unknown>;
  createdAt?: string;
  decidedAt?: string | null;
}

export interface ConnectorRunDTO {
  id: string;
  label: string;
  status: ConnectorRunStatus | string;
  summary: string;
  detail?: string;
  createdAt?: string;
}

export interface MemoryEntryDTO {
  id: string;
  organizationId: string;
  workerId?: string | null;
  taskId?: string | null;
  approvalId?: string | null;
  memoryType: string;
  visibilityScope: string;
  content: string;
  summary?: string;
  tags: string[];
  pinned?: boolean;
  createdAt?: string;
}

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
  segmentKind?: 'non_renewals' | 'hot_leads' | 'donor_leads' | 'sponsor_attrition' | 'custom';
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
