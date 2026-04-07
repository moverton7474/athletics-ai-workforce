# AUTH_MEMBERSHIP_NEXT_STEPS.md

## What this pass adds
- email magic-link login flow
- auth callback + middleware session refresh
- membership lookup in server shell
- demo-org bootstrap route for signed-in users
- first real membership-based select policies in Supabase

## Immediate next development steps
1. add sign-out control
2. add onboarding path that creates/claims org membership intentionally, not only demo bootstrap
3. add per-role UI gating (owner/admin/operator/collaborator)
4. move selected read paths from service-role fallback to true authenticated membership reads
5. add authenticated Playwright coverage for login + demo-org claim
6. start CSOS connector action loop on top of authenticated org context
