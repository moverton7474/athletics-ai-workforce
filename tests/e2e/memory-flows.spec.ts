import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    __memoryFlowMarker?: string;
  }
}

test('knowledge memory flows update in place without a full page reload', async ({ page }) => {
  const id = `pw-memory-${Date.now()}`;
  const initialSummary = `${id} initial summary`;
  const updatedSummary = `${id} updated summary`;
  const detail = `${id} detailed continuity note`;

  await page.goto('/knowledge');
  await page.evaluate(() => {
    window.__memoryFlowMarker = 'persist-without-reload';
  });

  await page.getByLabel('Memory Type').selectOption('handoff');
  await page.getByLabel('Visibility Scope').selectOption('organization');
  await page.getByLabel('Summary').fill(initialSummary);
  await page.getByLabel('Detailed Context').fill(detail);
  await page.getByLabel('Tags').fill('playwright, continuity');
  await page.getByRole('button', { name: 'Save Memory Entry' }).click();

  await expect(page.getByText(/Memory entry saved/i)).toBeVisible();
  const initialCard = page.locator('article').filter({ hasText: initialSummary }).first();
  await expect(initialCard).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__memoryFlowMarker)).toBe('persist-without-reload');

  await initialCard.getByRole('button', { name: 'Edit' }).click();
  await initialCard.getByLabel('Summary').fill(updatedSummary);
  await initialCard.getByLabel('Content').fill(`${detail} updated`);
  await initialCard.getByRole('button', { name: 'Save Changes' }).click();

  const updatedCard = page.locator('article').filter({ hasText: updatedSummary }).first();
  await expect(updatedCard).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__memoryFlowMarker)).toBe('persist-without-reload');

  await updatedCard.getByRole('button', { name: 'Pin' }).click();
  await expect(updatedCard.getByText('Pinned')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__memoryFlowMarker)).toBe('persist-without-reload');

  page.once('dialog', (dialog) => dialog.accept());
  await updatedCard.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('article').filter({ hasText: updatedSummary })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.__memoryFlowMarker)).toBe('persist-without-reload');
});

test('dashboard surfaces continuity coverage and resolution queues', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByRole('heading', { name: 'Continuity Coverage' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Resolve Next' })).toBeVisible();
  await expect(page.getByText(/open tasks linked to memory/i)).toBeVisible();
  await expect(page.getByText(/pending approvals linked to memory/i)).toBeVisible();
  await expect(page.getByText(/active workers linked to memory/i)).toBeVisible();
});
