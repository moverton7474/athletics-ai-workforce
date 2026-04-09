import {
  mockCampaignBuilderRecords,
  mockCampaignFollowUpRecords,
  mockCampaignReviewRecords,
  mockSegmentRecords,
} from '../../data/mock-route-state-records';
import {
  getCampaignBuilderState,
  getCampaignFollowUpState,
  getGeneratedAssetReviewState,
  getSegmentContext,
} from '../voice-route-state';
import type {
  CampaignBuilderState,
  CampaignChannelConfig,
  CampaignDraftRecordDTO,
  CampaignFollowUpState,
  GeneratedAsset,
  GeneratedAssetReviewState,
  SegmentContext,
} from '../types';
import { fetchCampaignDrafts, fetchSegmentDefinitions } from '../supabase-queries';

function normalizeChannels(value: unknown, fallback: CampaignChannelConfig[]): CampaignChannelConfig[] {
  return Array.isArray(value) && value.length ? (value as CampaignChannelConfig[]) : fallback;
}

function normalizeAssets(value: unknown, fallback: GeneratedAsset[]): GeneratedAsset[] {
  return Array.isArray(value) && value.length ? (value as GeneratedAsset[]) : fallback;
}

function mapSegmentRow(row: any): SegmentContext {
  const fallback = getSegmentContext(row.segment_key);

  return {
    ...fallback,
    segmentKey: row.segment_key,
    sourceType: row.source_type ?? fallback.sourceType,
    label: row.label ?? fallback.label,
    summary: row.summary ?? fallback.summary,
    rationale: row.rationale ?? fallback.rationale,
    audienceCount: row.audience_count ?? fallback.audienceCount,
    estimatedValue: typeof row.estimated_value === 'number' ? row.estimated_value : fallback.estimatedValue,
    filterDefinition:
      row.filter_definition && typeof row.filter_definition === 'object'
        ? row.filter_definition
        : fallback.filterDefinition,
    recommendedObjective:
      typeof row.metadata?.recommendedObjective === 'string'
        ? row.metadata.recommendedObjective
        : fallback.recommendedObjective,
    nextBestAction:
      typeof row.metadata?.nextBestAction === 'string'
        ? row.metadata.nextBestAction
        : fallback.nextBestAction,
    recoverableUrl:
      typeof row.metadata?.recoverableUrl === 'string'
        ? row.metadata.recoverableUrl
        : fallback.recoverableUrl,
  };
}

function mapCampaignDraftRecord(row: any): CampaignDraftRecordDTO {
  return {
    draftKey: row.draft_key,
    campaignKey: row.campaign_key,
    segmentKey: row.segment_key,
    title: row.title,
    objective: row.objective,
    status: row.status,
    selectedChannels: Array.isArray(row.selected_channels) ? row.selected_channels : [],
    assets: Array.isArray(row.assets) ? row.assets : [],
    details: row.details && typeof row.details === 'object' ? row.details : {},
    updatedAt: row.updated_at,
  };
}

function createFallbackDraftRecord(builderState: CampaignBuilderState): CampaignDraftRecordDTO {
  return {
    draftKey: builderState.draftId ?? `${builderState.linkedSegment.segmentKey}-draft`,
    campaignKey: builderState.campaignId ?? `${builderState.linkedSegment.segmentKey}-campaign`,
    segmentKey: builderState.linkedSegment.segmentKey,
    title: builderState.campaignName ?? 'Campaign draft',
    objective: builderState.campaignObjective,
    status: 'draft',
    selectedChannels: builderState.selectedChannels,
    assets: [],
    details: {
      operatorNotes: builderState.operatorNotes,
      prefilledFields: builderState.prefilledFields,
      operatorOverrides: builderState.operatorOverrides,
      missingRequiredFields: builderState.missingRequiredFields,
      approvalRequired: builderState.approvalRequired,
    },
  };
}

function mapCampaignDraftRow(row: any): CampaignBuilderState {
  const fallback = getCampaignBuilderState(row.segment_key, 'voice');
  const linkedSegment = getSegmentContext(row.segment_key);
  const details = row.details && typeof row.details === 'object' ? row.details : {};

  return {
    ...fallback,
    draftId: row.draft_key,
    campaignId: row.campaign_key ?? fallback.campaignId,
    linkedSegment,
    campaignName: row.title ?? fallback.campaignName,
    campaignObjective: row.objective ?? fallback.campaignObjective,
    selectedChannels: normalizeChannels(row.selected_channels, fallback.selectedChannels),
    operatorNotes: typeof details.operatorNotes === 'string' ? details.operatorNotes : fallback.operatorNotes,
    prefilledFields: Array.isArray(details.prefilledFields) ? details.prefilledFields : fallback.prefilledFields,
    operatorOverrides: Array.isArray(details.operatorOverrides) ? details.operatorOverrides : fallback.operatorOverrides,
    missingRequiredFields: Array.isArray(details.missingRequiredFields)
      ? details.missingRequiredFields
      : fallback.missingRequiredFields,
    approvalRequired:
      typeof details.approvalRequired === 'boolean' ? details.approvalRequired : fallback.approvalRequired,
    reviewRoute: `/campaigns/drafts/${row.draft_key}/review?segmentKey=${linkedSegment.segmentKey}`,
  };
}

function mapCampaignReviewState(row: any): GeneratedAssetReviewState {
  const fallback = getGeneratedAssetReviewState(row.draft_key, row.segment_key);

  return {
    ...fallback,
    draftId: row.draft_key,
    linkedSegment: getSegmentContext(row.segment_key),
    assets: normalizeAssets(row.assets, fallback.assets),
    reviewSummary:
      typeof row.details?.reviewSummary === 'string' ? row.details.reviewSummary : fallback.reviewSummary,
    pendingChannels: Array.isArray(row.details?.pendingChannels) ? row.details.pendingChannels : fallback.pendingChannels,
    approvedChannels: Array.isArray(row.details?.approvedChannels)
      ? row.details.approvedChannels
      : fallback.approvedChannels,
    rejectedChannels: Array.isArray(row.details?.rejectedChannels)
      ? row.details.rejectedChannels
      : fallback.rejectedChannels,
    nextApprovalRoute:
      typeof row.details?.nextApprovalRoute === 'string'
        ? row.details.nextApprovalRoute
        : `/approvals/${row.draft_key}-launch-approval?segmentKey=${row.segment_key}`,
  };
}

function mapCampaignFollowUpState(row: any): CampaignFollowUpState {
  const campaignKey = row.campaign_key ?? `${row.segment_key}-campaign`;
  const fallback = getCampaignFollowUpState(campaignKey, row.segment_key);

  return {
    ...fallback,
    campaignId: campaignKey,
    campaignName: row.title ?? fallback.campaignName,
    resultStatus: typeof row.details?.resultStatus === 'string' ? row.details.resultStatus : fallback.resultStatus,
    performanceSummary:
      typeof row.details?.performanceSummary === 'string'
        ? row.details.performanceSummary
        : fallback.performanceSummary,
    channelResults: Array.isArray(row.details?.channelResults) ? row.details.channelResults : fallback.channelResults,
    scheduledNotifications: Array.isArray(row.details?.scheduledNotifications)
      ? row.details.scheduledNotifications
      : fallback.scheduledNotifications,
    recommendedNextCampaign:
      row.details?.recommendedNextCampaign && typeof row.details.recommendedNextCampaign === 'object'
        ? row.details.recommendedNextCampaign
        : fallback.recommendedNextCampaign,
  };
}

export async function listSegmentsForRouteState() {
  const result = await fetchSegmentDefinitions();
  if (result.error || !result.data.length) {
    return {
      segments: mockSegmentRecords,
      source: 'mock' as const,
      error: result.error,
    };
  }

  return {
    segments: (result.data as any[]).map(mapSegmentRow),
    source: 'supabase' as const,
    error: null,
  };
}

export async function getSegmentForRouteState(segmentKey?: string) {
  const result = await listSegmentsForRouteState();
  return {
    segment:
      result.segments.find((segment) => segment.segmentKey === segmentKey) ??
      result.segments[0] ??
      getSegmentContext(segmentKey),
    source: result.source,
    error: result.error,
  };
}

export async function getCampaignBuilderForRouteState(segmentKey?: string, mode: 'manual' | 'voice' = 'voice') {
  const result = await fetchCampaignDrafts();
  const row = (result.data as any[]).find((draft) => draft.segment_key === segmentKey);

  if (result.error || !row) {
    const fallback =
      (segmentKey && Object.values(mockCampaignBuilderRecords).find((draft) => draft.linkedSegment.segmentKey === segmentKey)) ||
      getCampaignBuilderState(segmentKey, mode);

    return {
      builderState: fallback,
      draftRecord: createFallbackDraftRecord(fallback),
      source: 'mock' as const,
      error: result.error,
    };
  }

  return {
    builderState: mapCampaignDraftRow(row),
    draftRecord: mapCampaignDraftRecord(row),
    source: 'supabase' as const,
    error: null,
  };
}

export async function getCampaignReviewForRouteState(draftId: string, segmentKey?: string) {
  const result = await fetchCampaignDrafts();
  const row = (result.data as any[]).find((draft) => draft.draft_key === draftId);

  if (result.error || !row) {
    const reviewState = mockCampaignReviewRecords[draftId] ?? getGeneratedAssetReviewState(draftId, segmentKey);
    return {
      reviewState,
      draftRecord: {
        draftKey: reviewState.draftId,
        campaignKey: `${reviewState.linkedSegment.segmentKey}-campaign`,
        segmentKey: reviewState.linkedSegment.segmentKey,
        title: `${reviewState.linkedSegment.label} Campaign Draft`,
        objective: reviewState.linkedSegment.recommendedObjective,
        status: 'ready_for_review',
        selectedChannels: reviewState.assets.map((asset) => ({ channel: asset.channel, enabled: true })),
        assets: reviewState.assets,
        details: {
          reviewSummary: reviewState.reviewSummary,
          pendingChannels: reviewState.pendingChannels,
          approvedChannels: reviewState.approvedChannels,
          rejectedChannels: reviewState.rejectedChannels,
          nextApprovalRoute: reviewState.nextApprovalRoute,
        },
        updatedAt: undefined,
      },
      source: 'mock' as const,
      error: result.error,
    };
  }

  return {
    reviewState: mapCampaignReviewState(row),
    draftRecord: mapCampaignDraftRecord(row),
    source: 'supabase' as const,
    error: null,
  };
}

export async function listCampaignDraftRecords() {
  const result = await fetchCampaignDrafts();
  if (result.error || !result.data.length) {
    return {
      drafts: Object.values(mockCampaignBuilderRecords).map(createFallbackDraftRecord),
      source: 'mock' as const,
      error: result.error,
    };
  }

  return {
    drafts: (result.data as any[]).map(mapCampaignDraftRecord),
    source: 'supabase' as const,
    error: null,
  };
}

export async function getCampaignFollowUpForRouteState(campaignId: string, segmentKey?: string) {
  const result = await fetchCampaignDrafts();
  const row = (result.data as any[]).find((draft) => (draft.campaign_key ?? `${draft.segment_key}-campaign`) === campaignId);

  if (result.error || !row) {
    const fallback = mockCampaignFollowUpRecords[campaignId] ?? getCampaignFollowUpState(campaignId, segmentKey);
    return {
      followUpState: fallback,
      draftRecord: {
        draftKey: `${fallback.campaignId.replace(/-campaign$/, '')}-draft`,
        campaignKey: fallback.campaignId,
        segmentKey: fallback.recommendedNextCampaign?.suggestedSegmentKey ?? segmentKey ?? 'ksu-football-2026-non-renewals',
        title: fallback.campaignName,
        objective: fallback.recommendedNextCampaign?.suggestedObjective,
        status: 'approved_for_launch',
        selectedChannels: [],
        assets: [],
        details: {},
      },
      source: 'mock' as const,
      error: result.error,
    };
  }

  return {
    followUpState: mapCampaignFollowUpState(row),
    draftRecord: mapCampaignDraftRecord(row),
    source: 'supabase' as const,
    error: null,
  };
}
