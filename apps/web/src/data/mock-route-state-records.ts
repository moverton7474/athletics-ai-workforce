import type { CampaignBuilderState, CampaignFollowUpState, GeneratedAssetReviewState, SegmentContext } from '../lib/types';
import {
  getCampaignBuilderState,
  getCampaignFollowUpState,
  getGeneratedAssetReviewState,
  listSegmentContexts,
} from '../lib/voice-route-state';

export const mockSegmentRecords: SegmentContext[] = listSegmentContexts();

export const mockCampaignBuilderRecords: Record<string, CampaignBuilderState> = {
  'ksu-football-2026-non-renewals-draft': getCampaignBuilderState('ksu-football-2026-non-renewals', 'voice'),
  'ksu-hot-leads-draft': getCampaignBuilderState('ksu-hot-leads', 'voice'),
};

export const mockCampaignReviewRecords: Record<string, GeneratedAssetReviewState> = {
  'ksu-football-2026-non-renewals-draft': getGeneratedAssetReviewState(
    'ksu-football-2026-non-renewals-draft',
    'ksu-football-2026-non-renewals',
  ),
  'ksu-hot-leads-draft': getGeneratedAssetReviewState('ksu-hot-leads-draft', 'ksu-hot-leads'),
};

export const mockCampaignFollowUpRecords: Record<string, CampaignFollowUpState> = {
  'ksu-football-2026-non-renewals-campaign': getCampaignFollowUpState(
    'ksu-football-2026-non-renewals-campaign',
    'ksu-football-2026-non-renewals',
  ),
};
