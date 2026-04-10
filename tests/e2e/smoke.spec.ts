import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'athletics-ai-workforce' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/org/setup', heading: 'Build Your Athletics Workforce' },
  { path: '/team', heading: 'Generated Workforce Blueprint' },
  { path: '/workers', heading: 'Workers' },
  { path: '/tasks', heading: 'Tasks' },
  { path: '/segments', heading: 'Segments' },
  { path: '/segments/ksu-football-2026-non-renewals', heading: '2026 KSU Football Non-Renewals' },
  { path: '/segments/csos-sponsorship-pipeline', heading: 'CSOS Sponsorship Pipeline' },
  { path: '/campaigns/new', heading: 'New Campaign' },
  { path: '/campaigns/new/from-segment?segmentKey=ksu-football-2026-non-renewals', heading: 'Prefilled Campaign Builder' },
  { path: '/campaigns/drafts/ksu-football-2026-non-renewals-draft/review?segmentKey=ksu-football-2026-non-renewals', heading: 'Campaign Asset Review' },
  { path: '/campaigns/ksu-football-2026-non-renewals-campaign/results?segmentKey=ksu-football-2026-non-renewals', heading: 'KSU Football Season Ticket Sales Campaign' },
  { path: '/campaigns/ksu-football-2026-non-renewals-campaign/follow-up?segmentKey=ksu-football-2026-non-renewals', heading: 'Campaign Follow-Up' },
  { path: '/approvals', heading: 'Approvals' },
  { path: '/knowledge', heading: 'Knowledge Brain' },
  { path: '/voice', heading: 'Voice Commands' },
  { path: '/connector-runs', heading: 'Connector Runs' },
  { path: '/tasks/task-1', heading: 'Task Detail' },
  { path: '/approvals/approval-1', heading: 'Approval Review' },
  { path: '/approvals/ksu-football-2026-non-renewals-draft-launch-approval?segmentKey=ksu-football-2026-non-renewals', heading: 'Approval Review' },
];

test('public navigation reflects role-aware gating', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'athletics-ai-workforce' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View dashboard', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open workers', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start workforce setup', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View generated workforce', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Org Setup', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Approvals', exact: true })).toHaveCount(0);
});

for (const route of routes) {
  test(`route ${route.path} loads`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading, exact: true }).first()).toBeVisible();
  });
}

test('dashboard shows live runtime data state', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Supabase Runtime Status' })).toBeVisible();
  await expect(page.getByText(/Public Supabase environment variables are (present|missing) for this runtime/i)).toBeVisible();
  await expect(page.getByText(/Dashboard widgets are (loading from live Supabase data|currently falling back to seeded\/mock data)/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Connector Outcomes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Campaign Draft Approval State' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Connector Outcomes' })).toBeVisible();
  await expect(page.getByText('Awaiting approval').first()).toBeVisible();
  await expect(page.getByText('Linked approvals').first()).toBeVisible();
});

test('org setup form renders expected fields', async ({ page }) => {
  await page.goto('/org/setup');
  await expect(page.getByLabel('Organization Name')).toBeVisible();
  await expect(page.getByLabel('Website')).toBeVisible();
  await expect(page.getByLabel('Industry')).toBeVisible();
  await expect(page.getByLabel('Target Audiences')).toBeVisible();
  await expect(page.getByLabel('Tone of Voice')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Organization Profile' })).toBeVisible();
});

test('knowledge form renders expected fields', async ({ page }) => {
  await page.goto('/knowledge');
  await expect(page.getByLabel('Title')).toBeVisible();
  await expect(page.getByLabel('Source Type')).toBeVisible();
  await expect(page.getByLabel('URL / Reference')).toBeVisible();
  await expect(page.getByLabel('Content Notes')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Knowledge Item' })).toBeVisible();
});

test('connector runs page surfaces workflow lineage', async ({ page }) => {
  await page.goto('/connector-runs');
  await expect(page.getByRole('heading', { name: 'Connector run history' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Connector workflow snapshot' })).toBeVisible();

  if ((await page.getByRole('heading', { name: 'Workflow lineage' }).count()) > 0) {
    await expect(page.getByRole('heading', { name: 'Workflow lineage' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Operator next action' }).first()).toBeVisible();
  } else {
    await expect(page.getByText('No connector runs yet.')).toBeVisible();
  }
});

test('task and approval detail pages surface clear operator next actions', async ({ page }) => {
  await page.goto('/tasks');
  const taskLinks = page.getByRole('link', { name: 'Open task' });
  await expect(taskLinks.first()).toBeVisible();
  await taskLinks.first().click();
  await expect(page.getByRole('heading', { name: 'Operator Next Action' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Escalation clarity' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Capture continuity note' })).toBeVisible();

  await page.goto('/approvals');
  const approvalLinks = page.getByRole('link', { name: 'Open review' });
  if ((await approvalLinks.count()) > 0) {
    await approvalLinks.first().click();
    await expect(page.getByRole('heading', { name: 'Operator Next Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Escalation clarity' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Capture decision context' })).toBeVisible();
  } else {
    await expect(page.getByText('No approval requests yet.')).toBeVisible();
  }
});

test('segment to campaign shell path stays navigable end to end', async ({ page }) => {
  await page.goto('/segments');
  await expect(page.getByRole('heading', { name: 'Segments' })).toBeVisible();
  await page.getByRole('link', { name: 'Open segment detail' }).first().click();

  await expect(page.getByRole('heading', { name: '2026 KSU Football Non-Renewals' })).toBeVisible();
  await page.getByRole('link', { name: 'Open prefilled campaign builder' }).click();

  await expect(page.getByRole('heading', { name: 'Prefilled Campaign Builder' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'KSU Football Season Ticket Sales Campaign' })).toBeVisible();
  await page.getByRole('link', { name: 'Open generated asset review shell' }).click();

  await expect(page.getByRole('heading', { name: 'Campaign Asset Review' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review Summary', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Open launch approval shell' }).click();

  await expect(page.getByRole('heading', { name: 'Approval Review' })).toBeVisible();
  await expect(
    page
      .getByText(/shared route\/state contract layer/i)
      .or(page.getByRole('heading', { name: 'Workflow Context' }))
      .first(),
  ).toBeVisible();

  const fallbackResultsLink = page.getByRole('link', { name: 'Open post-decision results shell' });
  if ((await fallbackResultsLink.count()) > 0) {
    await fallbackResultsLink.first().click();
  } else {
    await page.getByRole('link', { name: 'Open results' }).first().click();
  }

  await expect(page.getByRole('heading', { name: 'KSU Football Season Ticket Sales Campaign' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recommended Next Campaign' })).toBeVisible();
});

test('voice mapped routes open the new shell paths', async ({ page }) => {
  await page.goto('/voice');
  await expect(page.getByRole('heading', { name: 'Voice Commands' })).toBeVisible();
  await page.getByRole('link', { name: 'Open mapped route' }).first().click();
  await expect(page.getByRole('heading', { name: '2026 KSU Football Non-Renewals' })).toBeVisible();
});

test('org setup hands off intake state into the workforce blueprint', async ({ page }) => {
  await page.goto('/org/setup');
  await page.getByLabel('Organization Name').fill('Milton Athletics');
  await page.getByLabel('Website').fill('https://milton.example.com');
  await page.getByLabel('Primary Goals').fill('Accelerate proposal throughput and tighten operator coordination.');
  await page.getByRole('link', { name: 'Continue to workforce blueprint' }).click();

  await expect(page.getByRole('heading', { name: 'Generated Workforce Blueprint' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Blueprint for Milton Athletics' })).toBeVisible();
  await expect(page.getByText('Accelerate proposal throughput and tighten operator coordination.')).toBeVisible();
  await expect(page.getByText('Website: https://milton.example.com')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recommended rollout sequence' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start this team' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'First-week operating checklist' })).toBeVisible();
  await expect(page.getByText('Shared workers')).toBeVisible();
  await expect(page.getByText('Personal workers')).toBeVisible();
  await expect(page.getByText('Start first')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Launch worker setup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Seed continuity memory' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open approval queue' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to workers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open knowledge brain' })).toBeVisible();
});
