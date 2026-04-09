import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'athletics-ai-workforce' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/org/setup', heading: 'Build Your Athletics Workforce' },
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
  await expect(page.getByText(/Public Supabase environment variables are present/i)).toBeVisible();
  await expect(page.getByText(/Dashboard widgets are loading from live Supabase data/i)).toBeVisible();
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
