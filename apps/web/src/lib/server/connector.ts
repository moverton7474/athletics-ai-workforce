import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DEMO_ORGANIZATION_ID } from '../constants';
import { createAuthServerClient } from '../auth/server';
import { getSupabaseServerClient } from './supabase-admin';

const execFileAsync = promisify(execFile);

type ConnectorActionConfig = {
  connectorName: string;
  triggerCode: string;
  taskTitle: string;
  taskDescription: string;
  cliArgs: string[];
  stubOutput: Record<string, unknown>;
  successMessage: {
    cli: string;
    stub: string;
  };
};

async function requireDemoMembership() {
  const authClient = await createAuthServerClient();
  const adminClient = getSupabaseServerClient();

  if (!authClient || !adminClient) {
    return { ok: false as const, status: 500, message: 'Auth or database client is not configured.' };
  }

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, message: 'You must be signed in first.' };
  }

  const membership = await adminClient
    .from('organization_members')
    .select('role')
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .eq('user_id', user.id)
    .maybeSingle();

  if (membership.error) {
    return { ok: false as const, status: 400, message: membership.error.message };
  }

  if (!membership.data) {
    return { ok: false as const, status: 403, message: 'You need organization membership before running connector actions.' };
  }

  return { ok: true as const, user, adminClient, membership: membership.data };
}

async function executeCsosCommand(config: ConnectorActionConfig) {
  try {
    const { stdout, stderr } = await execFileAsync('csos', config.cliArgs);
    const parsed = stdout ? JSON.parse(stdout) : null;
    return {
      status: 'success',
      mode: 'cli' as const,
      rawOutput: stdout,
      normalizedOutput: parsed,
      errorText: stderr || null,
    };
  } catch (error: any) {
    const message = error?.message ?? 'CSOS CLI execution failed.';

    return {
      status: 'success',
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

async function runConnectorAction(config: ConnectorActionConfig) {
  const membershipCheck = await requireDemoMembership();
  if (!membershipCheck.ok) {
    return membershipCheck;
  }

  const { user, adminClient } = membershipCheck;
  const connectorExecution = await executeCsosCommand(config);

  const agent = await adminClient
    .from('agents')
    .select('id')
    .eq('organization_id', DEMO_ORGANIZATION_ID)
    .ilike('role_name', '%Sponsorship Intelligence%')
    .limit(1)
    .maybeSingle();

  const connectorRun = await adminClient
    .from('connector_runs')
    .insert({
      organization_id: DEMO_ORGANIZATION_ID,
      agent_id: agent.data?.id ?? null,
      connector_name: config.connectorName,
      input: {
        trigger: config.triggerCode,
        initiated_by_user_id: user.id,
      },
      output: connectorExecution.normalizedOutput,
      status: connectorExecution.status,
      error_text: connectorExecution.errorText,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (connectorRun.error) {
    return { ok: false as const, status: 400, message: connectorRun.error.message };
  }

  const task = await adminClient.from('tasks').insert({
    organization_id: DEMO_ORGANIZATION_ID,
    agent_id: agent.data?.id ?? null,
    title: config.taskTitle,
    description: config.taskDescription,
    status: 'queued',
    priority: 'high',
  });

  if (task.error) {
    return { ok: false as const, status: 400, message: task.error.message };
  }

  return {
    ok: true as const,
    status: 200,
    message: connectorExecution.mode === 'cli' ? config.successMessage.cli : config.successMessage.stub,
    connectorMode: connectorExecution.mode,
    connectorRunId: connectorRun.data.id,
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
    successMessage: {
      cli: 'Sponsor alumni-match analysis completed through CSOS.',
      stub: 'Sponsor alumni-match analysis completed through stub connector mode.',
    },
  });
}
