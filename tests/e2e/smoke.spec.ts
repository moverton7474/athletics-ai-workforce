import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'athletics-ai-workforce' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/org/setup', heading: 'Build Your Athletics Workforce' },
  { path: '/team', heading: 'Generated Workforce Blueprint' },
  { path: '/workers', heading: 'Workers' },
  { path: '/tasks', heading: 'Tasks' },
  { path: '/approvals', heading: 'Approvals' },
  { path: '/knowledge', heading: 'Knowledge Brain' },
  { path: '/voice', heading: 'Voice Commands' },
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
