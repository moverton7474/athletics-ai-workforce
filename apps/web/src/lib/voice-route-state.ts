import type {
  ApprovalDecisionState,
  ApprovalQueueState,
  CampaignBuilderState,
  CampaignChannelConfig,
  CampaignFollowUpState,
  GeneratedAssetReviewState,
  RoutePrefillMeta,
  SegmentContext,
  SegmentQueryState,
} from './types';

const nowIso = '2026-04-09T15:15:00.000-04:00';
const staleAfterIso = '2026-04-10T15:15:00.000-04:00';

function buildPrefillMeta(overrides?: Partial<RoutePrefillMeta>): RoutePrefillMeta {
  return {
    entryMode: overrides?.entryMode ?? 'voice',
    voiceActionMode: overrides?.voiceActionMode ?? 'answer_and_navigate',
    initiatedAt: overrides?.initiatedAt ?? nowIso,
    sourceCommand: overrides?.sourceCommand ?? 'show me the relevant segment',
    sourceWorker: overrides?.sourceWorker ?? 'sponsorship_intelligence',
    confidence: overrides?.confidence ?? 'high',
    staleAfterIso: overrides?.staleAfterIso ?? staleAfterIso,
    initiatedByUserId: overrides?.initiatedByUserId,
  };
}

export const segmentLibrary: Record<string, SegmentContext> = {
  'ksu-football-2026-non-renewals': {
    segmentKey: 'ksu-football-2026-non-renewals',
    sourceType: 'deterministic_filter',
    label: '2026 KSU Football Non-Renewals',
    summary: 'Season ticket holders flagged as non-renewed for the 2026 football cycle.',
    rationale: 'Strong first recovery segment for a season-ticket sales campaign.',
    audienceCount: 184,
    estimatedValue: 126500,
    filterDefinition: {
      sport: 'football',
      season: '2026',
      ticketProduct: 'season_tickets',
      segmentKind: 'non_renewals',
      sort: 'revenue_desc',
    },
    recommendedObjective: 'Recover season-ticket revenue from non-renewed holders.',
    nextBestAction: 'Open the campaign builder with season-ticket recovery messaging prefilled.',
    recoverableUrl: '/segments/ksu-football-2026-non-renewals?sport=football&season=2026&segmentKind=non_renewals',
    prefillMeta: buildPrefillMeta({
      sourceCommand: 'show me 2026 KSU football non-renewals',
      sourceWorker: 'sponsorship_intelligence',
    }),
  },
  'ksu-hot-leads': {
    segmentKey: 'ksu-hot-leads',
    sourceType: 'saved_segment',
    label: 'KSU Hot Leads',
    summary: 'High-priority leads with strong recency, fit, and conversion potential.',
    rationale: 'Best near-term list for immediate campaign follow-up and operator review.',
    audienceCount: 42,
    estimatedValue: 98000,
    filterDefinition: {
      segmentKind: 'hot_leads',
      sort: 'priority_desc',
      limit: 50,
    },
    recommendedObjective: 'Move high-intent leads into personalized multi-channel outreach.',
    nextBestAction: 'Review the list, then open a campaign draft targeted to high-intent contacts.',
    recoverableUrl: '/segments/ksu-hot-leads?segmentKind=hot_leads',
    prefillMeta: buildPrefillMeta({
      sourceCommand: 'show me hot leads',
      sourceWorker: 'chief_of_staff',
    }),
  },
  'ksu-donor-leads': {
    segmentKey: 'ksu-donor-leads',
    sourceType: 'saved_segment',
    label: 'KSU Donor Leads',
    summary: 'Donor-oriented lead cohort combining giving history and current engagement signals.',
    rationale: 'Useful for donor follow-up, stewardship, and campaign recommendation flows.',
    audienceCount: 27,
    estimatedValue: 143000,
    filterDefinition: {
      segmentKind: 'donor_leads',
      sort: 'priority_desc',
      limit: 50,
    },
    recommendedObjective: 'Prioritize follow-up on donor leads most likely to respond to outreach.',
    nextBestAction: 'Open the donor-focused segment detail and prepare a tailored outreach path.',
    recoverableUrl: '/segments/ksu-donor-leads?segmentKind=donor_leads',
    prefillMeta: buildPrefillMeta({
      sourceCommand: 'show donor leads',
      sourceWorker: 'chief_of_staff',
    }),
  },
};

export function listSegmentContexts(): SegmentContext[] {
  return Object.values(segmentLibrary);
}

export function getSegmentContext(segmentKey?: string): SegmentContext {
  if (segmentKey && segmentLibrary[segmentKey]) {
    return segmentLibrary[segmentKey];
  }

  return segmentLibrary['ksu-football-2026-non-renewals'];
}

export function getSegmentQueryState(searchText?: string): SegmentQueryState {
  return {
    searchText,
    suggestedQueries: [
      '2026 KSU football non-renewals',
      'hot leads',
      'donor leads',
    ],
    activeFilters: searchText
      ? {
          queryText: searchText,
          segmentKind: searchText.toLowerCase().includes('donor')
            ? 'donor_leads'
            : searchText.toLowerCase().includes('hot')
              ? 'hot_leads'
              : 'custom',
        }
      : undefined,
    selectedSegmentKey: undefined,
    prefillMeta: buildPrefillMeta({
      entryMode: 'manual',
      voiceActionMode: 'answer_and_navigate',
      sourceCommand: searchText ? `search segments for ${searchText}` : 'open segment discovery',
    }),
  };
}

function defaultChannels(segment: SegmentContext): CampaignChannelConfig[] {
  const objective = segment.recommendedObjective ?? 'Launch a governed outreach campaign.';

  return [
    { channel: 'email', enabled: true, objective, audienceNotes: 'Primary channel for launch package.', assetCountTarget: 2 },
    { channel: 'sms', enabled: segment.segmentKey !== 'ksu-donor-leads', objective, audienceNotes: 'Short reminder and response nudge.', assetCountTarget: 1 },
    { channel: 'voice_call', enabled: true, objective, audienceNotes: 'Call script for high-value contacts.', assetCountTarget: 1 },
    { channel: 'personalized_video', enabled: segment.segmentKey === 'ksu-hot-leads', objective, audienceNotes: 'Reserved for highest-priority personalized follow-up.', assetCountTarget: 1 },
  ];
}

export function getCampaignBuilderState(segmentKey?: string, mode: 'manual' | 'voice' = 'voice'): CampaignBuilderState {
  const linkedSegment = getSegmentContext(segmentKey);

  return {
    draftId: undefined,
    linkedSegment,
    campaignName:
      linkedSegment.segmentKey === 'ksu-football-2026-non-renewals'
        ? 'KSU Football Season Ticket Sales Campaign'
        : `${linkedSegment.label} Outreach Campaign`,
    campaignObjective: linkedSegment.recommendedObjective ?? 'Launch a governed outreach campaign.',
    businessContext: {
      organizationId: 'org-demo',
      sport: linkedSegment.filterDefinition.sport ?? 'athletics',
      season: linkedSegment.filterDefinition.season ?? '2026',
      department: 'Ticket Sales',
    },
    selectedChannels: defaultChannels(linkedSegment),
    operatorNotes: 'Review generated assets by channel before creating launch approval.',
    prefilledFields: ['linkedSegment', 'campaignName', 'campaignObjective', 'selectedChannels'],
    operatorOverrides: [],
    missingRequiredFields: mode === 'manual' ? ['campaignObjective'] : [],
    approvalRequired: true,
    reviewRoute: `/campaigns/drafts/${linkedSegment.segmentKey}-draft/review`,
    prefillMeta: buildPrefillMeta({
      entryMode: mode,
      voiceActionMode: mode === 'voice' ? 'answer_navigate_prefill' : undefined,
      sourceCommand:
        linkedSegment.segmentKey === 'ksu-football-2026-non-renewals'
          ? 'build a KSU Football Season Ticket Sales Campaign'
          : `build a campaign for ${linkedSegment.label}`,
      sourceWorker: 'proposal_outreach',
    }),
  };
}

export function getGeneratedAssetReviewState(draftId: string, segmentKey?: string): GeneratedAssetReviewState {
  const linkedSegment = getSegmentContext(segmentKey);

  return {
    draftId,
    linkedSegment,
    assets: [
      {
        assetId: `${draftId}-email-1`,
        channel: 'email',
        title: 'Recovery Email Draft',
        bodyPreview: 'Highlight urgency, retained-seat value, and a direct renewal call to action.',
        status: 'ready_for_review',
      },
      {
        assetId: `${draftId}-sms-1`,
        channel: 'sms',
        title: 'Renewal SMS Nudge',
        bodyPreview: 'Short reminder with response prompt and renewal link placeholder.',
        status: 'ready_for_review',
      },
      {
        assetId: `${draftId}-voice-1`,
        channel: 'voice_call',
        title: 'Call Script',
        bodyPreview: 'Operator-ready phone script for high-value contacts.',
        status: 'changes_requested',
        changeRequestNote: 'Tighten opener and add donation-history context for premium contacts.',
      },
    ],
    reviewSummary: 'Email and SMS are nearly ready. Voice call script needs one operator pass before approval.',
    pendingChannels: ['email', 'sms', 'voice_call'],
    approvedChannels: [],
    rejectedChannels: [],
    requestChangesAllowed: true,
    nextApprovalRoute: `/approvals/${draftId}-launch-approval`,
    prefillMeta: buildPrefillMeta({
      voiceActionMode: 'answer_and_navigate',
      sourceCommand: 'review the generated campaign assets',
      sourceWorker: 'proposal_outreach',
    }),
  };
}

export function getApprovalDecisionState(approvalId: string, segmentKey?: string): ApprovalDecisionState {
  const linkedSegment = getSegmentContext(segmentKey);
  const campaignId = `${linkedSegment.segmentKey}-campaign`;
  const draftId = `${linkedSegment.segmentKey}-draft`;

  return {
    approvalId,
    approvalType: 'campaign_launch',
    title: 'Approve campaign launch and scheduling',
    summary: 'Human approval is required before channel scheduling or external send occurs.',
    campaignId,
    draftId,
    linkedSegment,
    dependencies: [
      { dependencyType: 'channel_asset', status: 'approved', label: 'Email copy approved' },
      { dependencyType: 'channel_asset', status: 'pending', label: 'Voice call script revision pending' },
      { dependencyType: 'schedule', status: 'blocked', label: 'Scheduling remains blocked until all selected channels are approved' },
    ],
    blockedActions: ['campaign scheduling', 'external send', 'operator automation handoff'],
    availableDecisions: ['approve', 'request_changes', 'reject'],
    decisionNoteRequired: true,
    postDecisionRoute: `/campaigns/${campaignId}/results`,
    prefillMeta: buildPrefillMeta({
      voiceActionMode: 'answer_navigate_pending_approval',
      sourceCommand: 'approve this campaign and schedule it',
      sourceWorker: 'compliance_coordination',
    }),
  };
}

export function getApprovalQueueState(): ApprovalQueueState {
  return {
    filter: 'pending',
    highlightedApprovalId: 'ksu-football-2026-non-renewals-draft-launch-approval',
    prefillMeta: buildPrefillMeta({
      sourceCommand: 'show pending approvals',
      sourceWorker: 'compliance_coordination',
      voiceActionMode: 'answer_and_navigate',
    }),
  };
}

export function getCampaignFollowUpState(campaignId: string, segmentKey?: string): CampaignFollowUpState {
  const linkedSegment = getSegmentContext(segmentKey);

  return {
    campaignId,
    campaignName:
      linkedSegment.segmentKey === 'ksu-football-2026-non-renewals'
        ? 'KSU Football Season Ticket Sales Campaign'
        : `${linkedSegment.label} Outreach Campaign`,
    resultStatus: 'underperforming',
    performanceSummary: 'Email engagement is healthy, but conversion remains below target. Follow-up should focus on high-value non-responders.',
    channelResults: [
      { channel: 'email', summary: 'Open rate is above target; clicks are mid-range.', status: 'completed' },
      { channel: 'sms', summary: 'SMS follow-up drove the fastest replies.', status: 'completed' },
      { channel: 'voice_call', summary: 'Call tasking remains scheduled for premium contacts.', status: 'scheduled' },
    ],
    scheduledNotifications: [
      {
        notificationId: `${campaignId}-follow-up-1`,
        label: 'Review non-responders and decide on second-touch sequence',
        scheduledForIso: '2026-04-12T09:00:00.000-04:00',
        status: 'scheduled',
      },
    ],
    recommendedNextCampaign: {
      reason: 'Initial conversion lag suggests a tighter premium-seat recovery segment is worth launching next.',
      suggestedSegmentKey: linkedSegment.segmentKey,
      suggestedObjective: 'Target premium non-responders with more personalized follow-up.',
      launchRoute: `/campaigns/${campaignId}/follow-up`,
    },
    prefillMeta: buildPrefillMeta({
      sourceCommand: 'how did that campaign perform',
      sourceWorker: 'chief_of_staff',
      voiceActionMode: 'answer_and_navigate',
    }),
  };
}
