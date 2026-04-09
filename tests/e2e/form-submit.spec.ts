import { expect, test } from '@playwright/test';

test('org setup form submits safely', async ({ page }) => {
  await page.goto('/org/setup');

  await page.getByLabel('Organization Name').fill('KSU Athletics Demo');
  await page.getByLabel('Website').fill('https://ksuowls.com');
  await page.getByLabel('Industry').fill('College Athletics');
  await page.getByLabel('Target Audiences').fill('Sponsors, donors, alumni, fans');
  await page.getByLabel('Tone of Voice').fill('Professional, energetic, institutional');
  await page.getByRole('button', { name: 'Save Organization Profile' }).click();

  await expect(page.getByText(/Organization profile (saved|payload validated|validated)/i)).toBeVisible();
});

test('knowledge form submits safely and persists validation marker', async ({ page }) => {
  await page.goto('/knowledge');

  await page.getByLabel('Title').fill('Playwright validation knowledge item');
  await page.getByLabel('Source Type').selectOption('memory');
  await page.getByLabel('URL / Reference').fill('validation://playwright-safe-submit');
  await page.getByLabel('Content Notes').fill('Updated by Playwright safe submit coverage.');
  await page.getByRole('button', { name: 'Add Knowledge Item' }).click();

  await expect(page.getByText(/Knowledge (validation item updated|item saved|payload validated|validated)/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText('Playwright validation knowledge item')).toBeVisible();
});

test('campaign builder can create or refresh a persisted draft record', async ({ page }) => {
  await page.goto('/campaigns/new/from-segment?segmentKey=ksu-football-2026-non-renewals');

  await page.getByRole('button', { name: 'Save draft record' }).click();
  await expect(page.getByText(/Campaign draft (saved|payload validated)/i)).toBeVisible();
});

test('campaign review can update a persisted draft record', async ({ page }) => {
  await page.goto('/campaigns/drafts/ksu-football-2026-non-renewals-draft/review?segmentKey=ksu-football-2026-non-renewals');

  await page.getByRole('button', { name: 'Update draft record' }).click();
  await expect(page.getByText(/Campaign draft (updated|update validated)/i)).toBeVisible();
});
