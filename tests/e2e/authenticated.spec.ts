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

  test('user can sign in, claim demo org, and run the connector workflow set', async ({ page }) => {
    const magicLink = await createMagicLink();

    await page.goto(magicLink);
    await page.waitForURL('**/login');

    await expect(page.getByText(new RegExp(authTestEmail, 'i')).first()).toBeVisible();
    await page.getByRole('button', { name: 'Claim demo organization' }).click();
    await expect(page.getByText(/Demo organization membership granted/i)).toBeVisible();

    await page.goto('/voice');

    await page.getByRole('button', { name: 'Run sponsor attrition analysis' }).click();
    await expect(page.getByText(/Sponsor attrition analysis completed/i)).toBeVisible();

    await page.getByRole('button', { name: 'Run sponsor category-gap analysis' }).click();
    await expect(page.getByText(/Sponsor category-gap analysis completed/i)).toBeVisible();

    await page.getByRole('button', { name: 'Run sponsor alumni-match analysis' }).click();
    await expect(page.getByText(/Sponsor alumni-match analysis completed/i)).toBeVisible();

    await page.getByLabel('Company').fill('Acme Roofing');
    await page.getByRole('button', { name: 'Run proposal create' }).click();
    await expect(page.getByText(/Proposal draft created/i)).toBeVisible();

    await page.goto('/connector-runs');
    await expect(page.getByText(/csos sponsor attrition --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos sponsor category-gaps --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos sponsor match-alumni --json/i).first()).toBeVisible();
    await expect(page.getByText(/csos proposal create/i).first()).toBeVisible();
  });
});
