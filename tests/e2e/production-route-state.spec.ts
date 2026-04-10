import { expect, test } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

test.describe('deployed route-state persistence', () => {
  test.skip(!externalBaseUrl, 'Run only against a deployed environment with PLAYWRIGHT_BASE_URL set.');

  test('review summary updates persist across reload on the deployed app', async ({ page }) => {
    const marker = `Playwright roundtrip ${Date.now()}`;
    const reviewPath = '/campaigns/drafts/ksu-football-2026-non-renewals-draft/review?segmentKey=ksu-football-2026-non-renewals';

    await page.goto(reviewPath);
    await expect(page.getByRole('heading', { name: 'Campaign Asset Review' })).toBeVisible();

    const summaryField = page.getByLabel('Review Summary');
    await summaryField.fill(marker);
    await page.getByRole('button', { name: 'Save review summary' }).click();
    await expect(page.getByText(/Campaign draft updated/i)).toBeVisible();

    await page.reload();
    await expect(page.getByRole('textbox', { name: 'Review Summary' })).toHaveValue(marker);
    await expect(page.locator('p').filter({ hasText: marker }).first()).toBeVisible();
  });

  test('campaign draft routes into a persisted approval on the deployed app', async ({ page }) => {
    const reviewPath = '/campaigns/drafts/ksu-football-2026-non-renewals-draft/review?segmentKey=ksu-football-2026-non-renewals';

    await page.goto(reviewPath);
    await expect(page.getByRole('heading', { name: 'Campaign Asset Review' })).toBeVisible();

    await page.getByRole('button', { name: 'Submit for approval' }).click();
    await expect(page.getByText(/(Campaign draft routed into approvals|already linked to an approval record)/i)).toBeVisible();

    const openApprovalLink = page.getByRole('link', { name: 'Open linked approval' }).first();
    await expect(openApprovalLink).toBeVisible();
    await openApprovalLink.click();

    await expect(page.getByRole('heading', { name: 'Approval Review' })).toBeVisible();
    await expect(page.getByText(/campaign launch/i).first()).toBeVisible();
  });
});
