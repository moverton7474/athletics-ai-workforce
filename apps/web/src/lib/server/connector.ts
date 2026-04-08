import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DEMO_ORGANIZATION_ID } from '../constants';
import { buildProposalApprovalRecord } from './approval-records';
import { PRIVILEGED_ORG_ROLES, requireDemoMembership } from './access';

const execFileAsync = promisify(execFile);

type ConnectorActionConfig = {
  connectorName: string;
  triggerCode: string;
  taskTitle: string;
  taskDescription: string;
  cliArgs: string[];
  stubOutput: Record<string, unknown>;
  input?: Record<string, unknown>;
  allowedRoles?: string[];
  successMessage: {
    cli: string;
    stub: string;
  };
  connectorStatus?: string;
  createApproval?: boolean;
  approvalType?: string;
  approvalTitle?: string;
  approvalSummary?: string;
  approvalDetails?: Record<string, unknown>;
};

type ConnectorExecutionResult = {
  status: string;
  mode: 'cli' | 'stub';
  rawOutput: string | null;
  normalizedOutput: Record<string, unknown> | null;
  errorText: string | null;
};

async function executeCsosCommand(config: ConnectorActionConfig): Promise<ConnectorExecutionResult> {
  const csosExecutable = process.env.CSOS_CLI_BIN || 'csos';

  try {
    const { stdout, stderr } = await execFileAsync(csosExecutable, config.cliArgs);
    const parsed = stdout ? JSON.parse(stdout) : null;
    return {
      status: config.connectorStatus ?? 'success',
      mode: 'cli' as const,
      rawOutput: stdout,
      normalizedOutput: parsed,
      errorText: stderr || null,
    };
  } catch (error: any) {
    const message = error?.message ?? 'CSOS CLI execution failed.';

    return {
      status: config.connectorStatus ?? 'success',
      mode: 'stub' as const,
      rawOutput: null,
      normalizedOutput: {
        ...config.stubOutput,
        stub: true,
        reason: message,
      },
      errorText: null,
    };
  }
}

async function findSponsorshipAgentId(adminClient: any) {
  const agent = await adminClient
    .from('agents')
    .select('id')
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .ilike('role_name', '%Sponsorship Intelligence%')
    .limit(1)
    .maybeSingle();

  return agent.data?.id ?? null;
}

async function createFollowUpTask(adminClient: any, agentId: string | null, title: string, description: string, priority: 'normal' | 'high' = 'high') {
  const task = await adminClient
    .from('tasks')
    .insert({
      organization_id: DEMO_ORGANIZATION_ID,
      agent_id: agentId,
      title,
      description,
      status: 'queued',
      priority,
    })
    .select('id')
    .single();

  return task;
}

async function runConnectorAction(config: ConnectorActionConfig) {
  const membershipCheck = await requireDemoMembership(config.allowedRoles);
  if (!membershipCheck.ok) {
    return membershipCheck;
  }

  const { user, adminClient } = membershipCheck;
  const connectorExecution = await executeCsosCommand(config);
  const agentId = await findSponsorshipAgentId(adminClient);

  const task = await createFollowUpTask(
    adminClient,
    agentId,
    config.taskTitle,
    config.taskDescription,
    config.createApproval ? 'high' : 'normal'
  );

  if (task.error) {
    return { ok: false as const, status: 400, message: task.error.message };
  }

  const connectorRun = await adminClient
    .from('connector_runs')
    .insert({
      organization_id: DEMO_ORGANIZATION_ID,
      agent_id: agentId,
      connector_name: config.connectorName,
      input: {
        trigger: config.triggerCode,
        initiated_by_user_id: user.id,
        ...(config.input ?? {}),
      },
      output: connectorExecution.normalizedOutput,
      status: config.createApproval ? 'awaiting_approval' : connectorExecution.status,
      error_text: connectorExecution.errorText,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (connectorRun.error) {
    return { ok: false as const, status: 400, message: connectorRun.error.message };
  }

  let approvalId: string | null = null;

  if (config.createApproval) {
    const proposalApproval =
      config.approvalType === 'proposal_review' && typeof config.input?.company === 'string'
        ? buildProposalApprovalRecord({
            company: config.input.company,
            connectorName: config.connectorName,
            connectorOutput: connectorExecution.normalizedOutput,
          })
        : null;

    const approval = await adminClient
      .from('approvals')
      .insert({
        organization_id: DEMO_ORGANIZATION_ID,
        task_id: task.data.id,
        connector_run_id: connectorRun.data.id,
        approval_type: proposalApproval?.approvalType ?? config.approvalType ?? 'proposal_review',
        title: proposalApproval?.title ?? config.approvalTitle ?? config.taskTitle,
        summary: proposalApproval?.summary ?? config.approvalSummary ?? config.taskDescription,
        requested_action: proposalApproval?.requestedAction ?? 'proposal_review',
        target_system: proposalApproval?.targetSystem ?? 'ksu_csos',
        entity_type: proposalApproval?.entityType ?? null,
        entity_name: proposalApproval?.entityName ?? null,
        stage: proposalApproval?.stage ?? null,
        next_action_label: proposalApproval?.nextActionLabel ?? null,
        details: proposalApproval
          ? proposalApproval.details
          : {
              connector_name: config.connectorName,
              requested_action: 'proposal_review',
              ...(config.approvalDetails ?? {}),
              connector_output: connectorExecution.normalizedOutput,
            },
        requested_by_agent_id: agentId,
        requested_by_user_id: user.id,
        status: 'pending',
      })
      .select('id')
      .single();

    if (approval.error) {
      return { ok: false as const, status: 400, message: approval.error.message };
    }

    approvalId = approval.data.id;
  }

  return {
    ok: true as const,
    status: 200,
    message: connectorExecution.mode === 'cli' ? config.successMessage.cli : config.successMessage.stub,
    connectorMode: connectorExecution.mode,
    connectorRunId: connectorRun.data.id,
    taskId: task.data.id,
    approvalId,
    output: connectorExecution.normalizedOutput,
  };
}

export async function runSponsorAttritionConnector() {
  return runConnectorAction({
    connectorName: 'csos sponsor attrition --json',
    triggerCode: 'voice.sponsor_attrition',
    taskTitle: 'Review sponsor attrition analysis',
    taskDescription: 'Generated from the sponsor attrition connector path.',
    cliArgs: ['sponsor', 'attrition', '--json'],
    stubOutput: {
      opportunities: [
        { sponsor: 'Acme Roofing', risk_score: 0.82, note: 'Detected by stub connector path.' },
        { sponsor: 'North Metro Bank', risk_score: 0.64, note: 'Stub follow-up candidate.' },
      ],
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: 'Sponsor attrition analysis completed through CSOS.',
      stub: 'Sponsor attrition analysis completed through stub connector mode.',
    },
  });
}

export async function runSponsorCategoryGapsConnector() {
  return runConnectorAction({
    connectorName: 'csos sponsor category-gaps --json',
    triggerCode: 'voice.sponsor_category_gaps',
    taskTitle: 'Review sponsor category-gap analysis',
    taskDescription: 'Generated from the sponsor category-gap connector path.',
    cliArgs: ['sponsor', 'category-gaps', '--json'],
    stubOutput: {
      category_gaps: [
        { category: 'Roofing', opportunity_score: 0.77, note: 'High-value alumni overlap candidate.' },
        { category: 'Banking', opportunity_score: 0.66, note: 'Moderate gap with sponsorship upside.' },
      ],
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: 'Sponsor category-gap analysis completed through CSOS.',
      stub: 'Sponsor category-gap analysis completed through stub connector mode.',
    },
  });
}

export async function runSponsorMatchAlumniConnector() {
  return runConnectorAction({
    connectorName: 'csos sponsor match-alumni --json',
    triggerCode: 'voice.sponsor_match_alumni',
    taskTitle: 'Review sponsor alumni-match analysis',
    taskDescription: 'Generated from the sponsor alumni-match connector path.',
    cliArgs: ['sponsor', 'match-alumni', '--json'],
    stubOutput: {
      matches: [
        { sponsor: 'Acme Roofing', alumni: 'Jordan Tate', confidence: 0.81, note: 'Former booster leadership overlap.' },
        { sponsor: 'North Metro Bank', alumni: 'Taylor Fields', confidence: 0.72, note: 'Strong executive affinity signal.' },
      ],
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: 'Sponsor alumni-match analysis completed through CSOS.',
      stub: 'Sponsor alumni-match analysis completed through stub connector mode.',
    },
  });
}

export async function runProposalCreateConnector(company = 'Acme Roofing') {
  return runConnectorAction({
    connectorName: 'csos proposal create',
    triggerCode: 'voice.proposal_create',
    taskTitle: `Review proposal draft for ${company}`,
    taskDescription: `Generated from the proposal-create connector path for ${company}.`,
    cliArgs: ['proposal', 'create', '--company', company],
    input: { company },
    stubOutput: {
      proposal: {
        company,
        status: 'draft',
        summary: `Proposal draft prepared for ${company}.`,
        requested_value: '$25,000',
        audience: 'Athletics sponsorship committee',
      },
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    createApproval: true,
    approvalType: 'proposal_review',
    approvalTitle: `Approve proposal package for ${company}`,
    approvalSummary: `Review the generated proposal package for ${company} before submission.`,
    approvalDetails: {
      company,
      stage: 'draft_review',
      recommended_next_action: 'Approve for submission prep',
    },
    successMessage: {
      cli: `Proposal draft created through CSOS for ${company} and routed into approvals.`,
      stub: `Proposal draft created through stub connector mode for ${company} and routed into approvals.`,
    },
  });
}

export async function runProposalViewConnector(company = 'Acme Roofing') {
  return runConnectorAction({
    connectorName: 'csos proposal view',
    triggerCode: 'voice.proposal_view',
    taskTitle: `Review proposal status for ${company}`,
    taskDescription: `Fetched the latest proposal status snapshot for ${company}.`,
    cliArgs: ['proposal', 'view', '--company', company, '--json'],
    input: { company },
    stubOutput: {
      proposal: {
        company,
        stage: 'review',
        owner: 'Proposal / Outreach Agent',
        note: 'Stub proposal status snapshot loaded.',
      },
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: `Proposal status loaded through CSOS for ${company}.`,
      stub: `Proposal status loaded through stub connector mode for ${company}.`,
    },
  });
}

export async function runProposalSubmitConnector(company = 'Acme Roofing') {
  return runConnectorAction({
    connectorName: 'csos proposal submit',
    triggerCode: 'voice.proposal_submit',
    taskTitle: `Confirm proposal submission for ${company}`,
    taskDescription: `Submission path executed for ${company}. Review the confirmation and downstream follow-up.`,
    cliArgs: ['proposal', 'submit', '--company', company, '--json'],
    input: { company },
    stubOutput: {
      proposal: {
        company,
        stage: 'submitted',
        submission_channel: 'stub-cli',
        note: 'Stub proposal submission completed.',
      },
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: `Proposal submission completed through CSOS for ${company}.`,
      stub: `Proposal submission completed through stub connector mode for ${company}.`,
    },
  });
}

export async function runReportingConnector(reportType = 'sponsorship-pipeline') {
  return runConnectorAction({
    connectorName: 'csos reporting run',
    triggerCode: 'voice.reporting_run',
    taskTitle: `Review ${reportType} report`,
    taskDescription: `Generated the latest ${reportType} report for review.`,
    cliArgs: ['reporting', 'run', '--report', reportType, '--json'],
    input: { reportType },
    stubOutput: {
      report: {
        report_type: reportType,
        generated_at: new Date().toISOString(),
        note: 'Stub reporting output generated.',
      },
    },
    allowedRoles: [...PRIVILEGED_ORG_ROLES],
    successMessage: {
      cli: `Reporting completed through CSOS for ${reportType}.`,
      stub: `Reporting completed through stub connector mode for ${reportType}.`,
    },
  });
}
