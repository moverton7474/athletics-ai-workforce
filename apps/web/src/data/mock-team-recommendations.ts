export type TeamRecommendation = {
  name: string;
  roleName: string;
  mode: 'shared' | 'personal';
  rationale: string;
  focus: string[];
};

const baseTeam: TeamRecommendation[] = [
  {
    name: 'Atlas',
    roleName: 'Chief of Staff',
    mode: 'shared',
    rationale: 'Coordinates cross-functional execution, approvals, and leadership priorities.',
    focus: ['Executive summaries', 'Cross-team coordination', 'Approval escalation'],
  },
  {
    name: 'Eva',
    roleName: 'Executive Assistant',
    mode: 'personal',
    rationale: 'Packages daily priorities, follow-ups, and preparation work for leadership.',
    focus: ['Daily digests', 'Meeting prep', 'Follow-up packaging'],
  },
  {
    name: 'Stan',
    roleName: 'Sponsorship Intelligence',
    mode: 'shared',
    rationale: 'Analyzes sponsor signals and surfaces pipeline opportunities worth acting on.',
    focus: ['Attrition analysis', 'Category gaps', 'Relationship signals'],
  },
  {
    name: 'Piper',
    roleName: 'Proposal / Outreach',
    mode: 'shared',
    rationale: 'Turns pipeline insights into proposal drafts, outreach packages, and review-ready work.',
    focus: ['Proposal drafting', 'Outreach prep', 'Submission readiness'],
  },
  {
    name: 'Nova',
    roleName: 'Compliance & Coordination',
    mode: 'shared',
    rationale: 'Keeps governed workflows clean, auditable, and ready for operator review.',
    focus: ['Approval hygiene', 'Task governance', 'Operational auditability'],
  },
];

export function recommendTeam(input: {
  industry?: string;
  targetCustomers?: string;
  toneOfVoice?: string;
  primaryGoals?: string;
}) {
  const audience = `${input.targetCustomers ?? ''} ${input.primaryGoals ?? ''}`.toLowerCase();
  const industry = (input.industry ?? '').toLowerCase();

  return baseTeam.map((member) => {
    if (member.roleName === 'Sponsorship Intelligence' && (audience.includes('donor') || audience.includes('alumni'))) {
      return {
        ...member,
        rationale: 'Analyzes sponsor, donor, and alumni relationship signals to surface revenue opportunities.',
      };
    }

    if (member.roleName === 'Proposal / Outreach' && industry.includes('athletics')) {
      return {
        ...member,
        rationale: 'Packages athletics-specific sponsorship proposals and outreach motions for operator review.',
      };
    }

    if (member.roleName === 'Executive Assistant' && audience.includes('executive')) {
      return {
        ...member,
        rationale: 'Optimized to support leadership communication, daily prep, and executive follow-through.',
      };
    }

    return member;
  });
}
