import Link from 'next/link';

function humanize(value?: string) {
  return value ? value.replaceAll('_', ' ') : undefined;
}

export function CampaignNextActionCard({
  currentSurface,
  draftStatus,
  approvalStatus,
  workflowState,
  reviewRoute,
  approvalRoute,
  resultsRoute,
  followUpRoute,
}: {
  currentSurface: 'review' | 'approval' | 'results' | 'follow_up';
  draftStatus: string;
  approvalStatus?: string;
  workflowState?: string;
  reviewRoute?: string;
  approvalRoute?: string;
  resultsRoute?: string;
  followUpRoute?: string;
}) {
  let title = 'Next Action';
  let description = 'Review the current workflow state and move the campaign forward deliberately.';
  let href: string | undefined;
  let linkLabel: string | undefined;

  if (approvalStatus === 'pending') {
    title = 'Resolve approval gate';
    if (currentSurface === 'approval') {
      description = 'Record an approval decision here so the workflow can move forward.';
    } else {
      description = 'This draft is waiting on a human approval decision before launch or scheduling can continue.';
      href = approvalRoute;
      linkLabel = 'Open linked approval';
    }
  } else if (approvalStatus === 'approved' || draftStatus === 'approved_for_launch' || workflowState === 'approved_for_launch') {
    title = 'Advance into results and follow-up';
    if (currentSurface === 'results') {
      description = 'Review performance, then move into the recommended follow-up path.';
      href = followUpRoute;
      linkLabel = 'Open follow-up';
    } else if (currentSurface === 'follow_up') {
      description = 'Use the follow-up recommendation to decide whether to launch the next campaign.';
      href = resultsRoute;
      linkLabel = 'Back to results';
    } else {
      description = 'The campaign is approved for launch. Review results and next-step recommendations.';
      href = resultsRoute;
      linkLabel = 'Open results';
    }
  } else if (approvalStatus === 'changes_requested' || draftStatus === 'changes_requested' || workflowState === 'revision_requested') {
    title = 'Revise and resubmit';
    description = 'Changes were requested. Return to the draft review surface, update the assets, and resubmit for approval.';
    href = reviewRoute;
    linkLabel = currentSurface === 'review' ? undefined : 'Open draft review';
  } else if (approvalStatus === 'rejected' || draftStatus === 'rejected' || workflowState === 'closed_rejected') {
    title = 'Reassess campaign direction';
    description = 'This workflow was rejected. Review the draft, note the rationale, and decide whether to rebuild or abandon the campaign.';
    href = reviewRoute;
    linkLabel = currentSurface === 'review' ? undefined : 'Open draft review';
  } else if (!approvalStatus && currentSurface === 'review') {
    title = 'Submit for approval';
    description = `Finish review and route this draft into approvals. Current workflow state: ${humanize(workflowState) ?? humanize(draftStatus) ?? 'draft review'}.`;
  } else {
    title = 'Return to draft review';
    description = 'The safest next move is to open the draft review surface and confirm readiness before taking the next workflow action.';
    href = reviewRoute;
    linkLabel = currentSurface === 'review' ? undefined : 'Open draft review';
  }

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Operator Next Action</h2>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h3>
        <p style={{ margin: 0 }}>{description}</p>
      </div>
      {href && linkLabel ? (
        <div>
          <Link href={href}>{linkLabel}</Link>
        </div>
      ) : null}
    </section>
  );
}
