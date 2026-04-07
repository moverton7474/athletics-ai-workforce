import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { DEMO_ORGANIZATION_ID } from '../constants';
import { createAuthServerClient } from '../auth/server';
import { getSupabaseServerClient } from './supabase-admin';

const execFileAsync = promisify(execFile);

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

async function executeCsosSponsorAttrition() {
  try {
    const { stdout, stderr } = await execFileAsync('csos', ['sponsor', 'attrition', '--json']);
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
        stub: true,
        reason: message,
        opportunities: [
          { sponsor: 'Acme Roofing', risk_score: 0.82, note: 'Detected by stub connector path.' },
          { sponsor: 'North Metro Bank', risk_score: 0.64, note: 'Stub follow-up candidate.' },
        ],
      },
      errorText: null,
    };
  }
}

export async function runSponsorAttritionConnector() {
  const membershipCheck = await requireDemoMembership();
  if (!membershipCheck.ok) {
    return membershipCheck;
  }

  const { user, adminClient } = membershipCheck;
  const connectorExecution = await executeCsosSponsorAttrition();

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
      connector_name: 'csos sponsor attrition --json',
      input: {
        trigger: 'voice.sponsor_attrition',
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
    title: 'Review sponsor attrition analysis',
    description: 'Generated from the first CSOS connector run path.',
    status: 'queued',
    priority: 'high',
  });

  if (task.error) {
    return { ok: false as const, status: 400, message: task.error.message };
  }

  return {
    ok: true as const,
    status: 200,
    message:
      connectorExecution.mode === 'cli'
        ? 'Sponsor attrition analysis completed through CSOS.'
        : 'Sponsor attrition analysis completed through stub connector mode.',
    connectorMode: connectorExecution.mode,
    connectorRunId: connectorRun.data.id,
    output: connectorExecution.normalizedOutput,
  };
}
