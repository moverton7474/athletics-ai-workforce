import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const requiredConfigured = Boolean(baseUrl && supabaseUrl && serviceRoleKey);
const authTestEmail = process.env.PLAYWRIGHT_AUTH_TEST_EMAIL || 'playwright-auth@athletics-ai-workforce.local';

async function createMagicLink() {
  if (!supabaseUrl || !serviceRoleKey || !baseUrl) {
    throw new Error('Missing required auth test environment variables.');
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await admin.auth.admin.createUser({
    email: authTestEmail,
    email_confirm: true,
  }).catch(() => undefined);

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: authTestEmail,
    options: {
      redirectTo: `${baseUrl}/auth/complete`,
    },
  });

  if (error) {
    throw error;
  }

  const actionLink = new URL(data.properties?.action_link as string);
  actionLink.searchParams.set('redirect_to', `${baseUrl}/auth/complete`);

  const response = await fetch(actionLink.toString(), { redirect: 'manual' });
  const redirected = new URL(response.headers.get('location') as string);
  const completionUrl = new URL('/auth/complete', baseUrl);
  completionUrl.hash = redirected.hash;
  return completionUrl.toString();
}

test.describe('authenticated membership flow', () => {
  test.skip(!requiredConfigured, 'Missing Supabase service-role env vars for authenticated Playwright coverage.');

  test('user can run connector workflows through approval orchestration', async ({ page }) => {
    const magicLink = await createMagicLink();

    await page.goto(magicLink);
    await page.waitForURL('**/login');

    await expect(page.getByText(new RegExp(authTestEmail, 'i')).first()).toBeVisible();

    const claimButton = page.getByRole('button', { name: 'Claim demo organization' });
    if (await claimButton.count()) {
      await claimButton.click();
      await expect(page.getByText(/Demo organization membership granted/i)).toBeVisible();
    }

    await page.goto('/voice');

    await page.getByRole('button', { name: 'Run sponsor attrition analysis' }).click();
    await expect(page.getByText(/Sponsor attrition analysis completed/i)).toBeVisible();

    await page.getByRole('button', { name: 'Run sponsor category-gap analysis' }).click();
    await expect(page.getByText(/Sponsor category-gap analysis completed/i)).toBeVisible();

    await page.getByRole('button', { name: 'Run sponsor alumni-match analysis' }).click();
    await expect(page.getByText(/Sponsor alumni-match analysis completed/i)).toBeVisible();

    await page.getByLabel('Company').fill('Acme Roofing');
    await page.getByRole('button', { name: 'Run proposal create' }).click();
    await expect(page.getByText(/routed into approvals/i)).toBeVisible();

    await page.goto('/connector-runs');
    await expect(page.getByText(/csos sponsor attrition --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos sponsor category-gaps --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos sponsor match-alumni --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos proposal create/i).first()).toBeVisible();

    await page.goto('/approvals');
    await expect(page.getByText(/Approve proposal package for Acme Roofing/i).first()).toBeVisible();
    await page.getByRole('link', { name: /Open review/i }).last().click();
    await expect(page.getByRole('heading', { name: /Approval Review/i })).toBeVisible();
    await expect(page.getByText(/Requested action: proposal submit/i)).toBeVisible();
    await page.getByLabel('Review note').last().fill('Looks good. Move this into submission prep.');
    await page.getByRole('button', { name: 'Approve' }).last().click();
    await expect(page.getByText(/Approval recorded and proposal workflow advanced/i)).toBeVisible();

    await page.goto('/tasks');
    await expect(page.getByText(/Prepare proposal submission for Acme Roofing/i).first()).toBeVisible();

    await page.goto('/dashboard');
    await expect(page.getByText(/Queued approvals:/i)).toBeVisible();
    await expect(page.getByText(/Next Actions/i)).toBeVisible();
    await expect(page.getByText(/Latest Connector Outcomes/i)).toBeVisible();
  });
});
