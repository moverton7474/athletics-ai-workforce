export const voiceCommandRegistry = [
  {
    code: 'chief_of_staff.start_sponsorship_recovery',
    label: 'Start sponsorship recovery workflow',
    workerRole: 'Chief of Staff',
    actionType: 'workflow.start',
    exampleUtterances: ['start sponsorship recovery workflow'],
  },
  {
    code: 'executive_assistant.create_daily_briefing',
    label: 'Create daily athletics briefing',
    workerRole: 'Executive Assistant',
    actionType: 'briefing.create',
    exampleUtterances: ['create daily athletics briefing'],
  },
  {
    code: 'sponsorship_intelligence.analyze_attrition',
    label: 'Analyze sponsor attrition',
    workerRole: 'Sponsorship Intelligence',
    actionType: 'csos.sponsor.attrition',
    exampleUtterances: ['analyze sponsor attrition', 'show me sponsor attrition analysis'],
  },
  {
    code: 'sponsorship_intelligence.match_alumni',
    label: 'Match alumni to sponsor opportunities',
    workerRole: 'Sponsorship Intelligence',
    actionType: 'csos.sponsor.match_alumni',
    exampleUtterances: ['find alumni matches for roofing category'],
  },
  {
    code: 'proposal_outreach.create_proposal',
    label: 'Create proposal for company',
    workerRole: 'Proposal & Outreach',
    actionType: 'csos.proposal.create',
    exampleUtterances: ['create proposal for ABC Construction'],
  },
  {
    code: 'compliance.show_pending_approvals',
    label: 'Show pending approvals',
    workerRole: 'Compliance & Coordination',
    actionType: 'approval.list',
    exampleUtterances: ['show pending approvals'],
  },
];
