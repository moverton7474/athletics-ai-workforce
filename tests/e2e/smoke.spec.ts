import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'athletics-ai-workforce' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/org/setup', heading: 'Organization Setup' },
  { path: '/workers', heading: 'Workers' },
  { path: '/tasks', heading: 'Tasks' },
  { path: '/approvals', heading: 'Approvals' },
  { path: '/knowledge', heading: 'Knowledge Brain' },
  { path: '/voice', heading: 'Voice' },
];

test('global navigation is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'AAW' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Org Setup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Workers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Approvals' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Knowledge' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Voice' })).toBeVisible();
});

for (const route of routes) {
  test(`route ${route.path} loads`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
  });
}

test('dashboard shows runtime data state', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Supabase Runtime Status' })).toBeVisible();
  await expect(page.getByText(/Public Supabase environment variables/i)).toBeVisible();
  await expect(page.getByText(/Dashboard widgets are/i)).toBeVisible();
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
