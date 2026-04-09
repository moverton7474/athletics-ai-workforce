insert into segment_definitions (
  organization_id,
  segment_key,
  label,
  source_type,
  summary,
  rationale,
  audience_count,
  estimated_value,
  filter_definition,
  metadata
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'ksu-football-2026-non-renewals',
    '2026 KSU Football Non-Renewals',
    'deterministic_filter',
    'Season ticket holders flagged as non-renewed for the 2026 football cycle.',
    'Strong first recovery segment for a season-ticket sales campaign.',
    184,
    126500,
    '{"sport":"football","season":"2026","ticketProduct":"season_tickets","segmentKind":"non_renewals","sort":"revenue_desc"}'::jsonb,
    '{"recommendedObjective":"Recover season-ticket revenue from non-renewed holders.","nextBestAction":"Open the campaign builder with season-ticket recovery messaging prefilled.","recoverableUrl":"/segments/ksu-football-2026-non-renewals?sport=football&season=2026&segmentKind=non_renewals"}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'ksu-hot-leads',
    'KSU Hot Leads',
    'saved_segment',
    'High-priority leads with strong recency, fit, and conversion potential.',
    'Best near-term list for immediate campaign follow-up and operator review.',
    42,
    98000,
    '{"segmentKind":"hot_leads","sort":"priority_desc","limit":50}'::jsonb,
    '{"recommendedObjective":"Move high-intent leads into personalized multi-channel outreach.","nextBestAction":"Review the list, then open a campaign draft targeted to high-intent contacts.","recoverableUrl":"/segments/ksu-hot-leads?segmentKind=hot_leads"}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'ksu-donor-leads',
    'KSU Donor Leads',
    'saved_segment',
    'Donor-oriented lead cohort combining giving history and current engagement signals.',
    'Useful for donor follow-up, stewardship, and campaign recommendation flows.',
    27,
    143000,
    '{"segmentKind":"donor_leads","sort":"priority_desc","limit":50}'::jsonb,
    '{"recommendedObjective":"Prioritize follow-up on donor leads most likely to respond to outreach.","nextBestAction":"Open the donor-focused segment detail and prepare a tailored outreach path.","recoverableUrl":"/segments/ksu-donor-leads?segmentKind=donor_leads"}'::jsonb
  )
on conflict (segment_key) do update set
  label = excluded.label,
  source_type = excluded.source_type,
  summary = excluded.summary,
  rationale = excluded.rationale,
  audience_count = excluded.audience_count,
  estimated_value = excluded.estimated_value,
  filter_definition = excluded.filter_definition,
  metadata = excluded.metadata,
  updated_at = now();

insert into campaign_drafts (
  organization_id,
  draft_key,
  campaign_key,
  segment_key,
  title,
  objective,
  status,
  selected_channels,
  assets,
  details
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'ksu-football-2026-non-renewals-draft',
    'ksu-football-2026-non-renewals-campaign',
    'ksu-football-2026-non-renewals',
    'KSU Football Season Ticket Sales Campaign',
    'Recover season-ticket revenue from non-renewed holders.',
    'draft',
    '[
      {"channel":"email","enabled":true,"objective":"Recover season-ticket revenue from non-renewed holders.","audienceNotes":"Primary channel for launch package.","assetCountTarget":2},
      {"channel":"sms","enabled":true,"objective":"Recover season-ticket revenue from non-renewed holders.","audienceNotes":"Short reminder and response nudge.","assetCountTarget":1},
      {"channel":"voice_call","enabled":true,"objective":"Recover season-ticket revenue from non-renewed holders.","audienceNotes":"Call script for high-value contacts.","assetCountTarget":1},
      {"channel":"personalized_video","enabled":false,"objective":"Recover season-ticket revenue from non-renewed holders.","audienceNotes":"Reserved for highest-priority personalized follow-up.","assetCountTarget":1}
    ]'::jsonb,
    '[
      {"assetId":"ksu-football-2026-non-renewals-draft-email-1","channel":"email","title":"Recovery Email Draft","bodyPreview":"Highlight urgency, retained-seat value, and a direct renewal call to action.","status":"ready_for_review"},
      {"assetId":"ksu-football-2026-non-renewals-draft-sms-1","channel":"sms","title":"Renewal SMS Nudge","bodyPreview":"Short reminder with response prompt and renewal link placeholder.","status":"ready_for_review"},
      {"assetId":"ksu-football-2026-non-renewals-draft-voice-1","channel":"voice_call","title":"Call Script","bodyPreview":"Operator-ready phone script for high-value contacts.","status":"changes_requested","changeRequestNote":"Tighten opener and add donation-history context for premium contacts."}
    ]'::jsonb,
    '{"operatorNotes":"Review generated assets by channel before creating launch approval.","prefilledFields":["linkedSegment","campaignName","campaignObjective","selectedChannels"],"operatorOverrides":[],"missingRequiredFields":[],"approvalRequired":true,"reviewSummary":"Email and SMS are nearly ready. Voice call script needs one operator pass before approval.","pendingChannels":["email","sms","voice_call"],"approvedChannels":[],"rejectedChannels":[],"nextApprovalRoute":"/approvals/ksu-football-2026-non-renewals-draft-launch-approval?segmentKey=ksu-football-2026-non-renewals","resultStatus":"underperforming","performanceSummary":"Email engagement is healthy, but conversion remains below target. Follow-up should focus on high-value non-responders.","channelResults":[{"channel":"email","summary":"Open rate is above target; clicks are mid-range.","status":"completed"},{"channel":"sms","summary":"SMS follow-up drove the fastest replies.","status":"completed"},{"channel":"voice_call","summary":"Call tasking remains scheduled for premium contacts.","status":"scheduled"}],"scheduledNotifications":[{"notificationId":"ksu-football-2026-non-renewals-campaign-follow-up-1","label":"Review non-responders and decide on second-touch sequence","scheduledForIso":"2026-04-12T09:00:00.000-04:00","status":"scheduled"}],"recommendedNextCampaign":{"reason":"Initial conversion lag suggests a tighter premium-seat recovery segment is worth launching next.","suggestedSegmentKey":"ksu-football-2026-non-renewals","suggestedObjective":"Target premium non-responders with more personalized follow-up.","launchRoute":"/campaigns/ksu-football-2026-non-renewals-campaign/follow-up"}}'::jsonb
  )
on conflict (draft_key) do update set
  campaign_key = excluded.campaign_key,
  segment_key = excluded.segment_key,
  title = excluded.title,
  objective = excluded.objective,
  status = excluded.status,
  selected_channels = excluded.selected_channels,
  assets = excluded.assets,
  details = excluded.details,
  updated_at = now();
