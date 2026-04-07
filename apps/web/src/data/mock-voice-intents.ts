export const mockVoiceIntents = [
  {
    code: 'chief_of_staff.start_sponsorship_recovery',
    label: 'Start sponsorship recovery workflow',
    workerRole: 'Chief of Staff',
    actionType: 'workflow.start',
  },
  {
    code: 'sponsorship_intelligence.analyze_attrition',
    label: 'Analyze sponsor attrition',
    workerRole: 'Sponsorship Intelligence',
    actionType: 'csos.sponsor.attrition',
  },
  {
    code: 'proposal_outreach.create_proposal',
    label: 'Create proposal for company',
    workerRole: 'Proposal & Outreach',
    actionType: 'csos.proposal.create',
  },
];
