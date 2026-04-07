export const commandTemplateRegistry = [
  {
    code: 'sponsor_attrition',
    name: 'Sponsor Attrition',
    command: 'csos sponsor attrition --json',
    description: 'Analyze sponsorship attrition.',
  },
  {
    code: 'sponsor_category_gaps',
    name: 'Sponsor Category Gaps',
    command: 'csos sponsor category-gaps --json',
    description: 'Find highest-value sponsorship category gaps.',
  },
  {
    code: 'proposal_create',
    name: 'Proposal Create',
    command: 'csos proposal create --company {{company}} --value {{value}}',
    description: 'Create a sponsorship proposal shell.',
  },
];
