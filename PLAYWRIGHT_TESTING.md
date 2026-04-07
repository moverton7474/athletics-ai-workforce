# PLAYWRIGHT_TESTING.md

## Purpose
Run a stable Playwright smoke suite against either:
- a local dev server, or
- the deployed Vercel URL after deployment.

## What is covered now
- top-level route availability
- global navigation visibility
- dashboard runtime status card
- org setup form presence
- knowledge ingestion form presence

This is intentionally a smoke suite first. It validates that core surfaces load after deployment without creating noisy production writes.

## Local usage
```bash
npm install
npx playwright install chromium
npx playwright test
```

When `PLAYWRIGHT_BASE_URL` is not set, Playwright starts the local app automatically with `npm run dev`.

## Deployed usage
```bash
PLAYWRIGHT_BASE_URL=https://athletics-ai-workforce-web.vercel.app npx playwright test
```

## GitHub Actions
Workflow file:
- `.github/workflows/playwright-deploy-smoke.yml`

It can run in two ways:
1. automatically on successful `deployment_status` events
2. manually with `workflow_dispatch` and an optional `base_url`

## Recommended next expansions
- worker detail route coverage once worker cards link into workspace routes
- non-destructive form submission checks using preview/test data
- authenticated flow coverage once auth is live
- screenshot snapshots for dashboard/workers/knowledge/approvals
- separate preview vs production suites
