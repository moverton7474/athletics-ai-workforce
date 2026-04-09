# NEXT_SESSION_BOOTSTRAP.md

## Mandatory startup order for the next session

Before any new implementation work, read these in this exact order:

1. `/data/.openclaw/workspace/MEMORY.md` **fully, end to end, every word**
2. `SESSION_HANDOFF_2026-04-09_END_OF_SESSION.md` **fully, end to end**
3. `ROADMAP.md`
4. `PRODUCT_DESCRIPTION.md`
5. `SESSION_HANDOFF_2026-04-08_EVENING.md`
6. `SESSION_HANDOFF_2026-04-07_LATE.md`
7. `NEW_SESSION_HANDOFF.md`
8. `VOICE_FIRST_INTEGRATION_PLAN.md`
9. `THREE_PILLARS_ALIGNMENT.md`
10. `CSOS_ADAPTER_SPEC.md`

Do not start coding before that reading sequence is complete.

## Mandatory validation sequence
After the docs review and before new feature work:

1. confirm current branch + `git status --short`
2. confirm GitHub is the source of truth and local repo is up to date
3. confirm live production URL is still `https://athletics-ai-workforce-web.vercel.app`
4. rerun Playwright smoke against production
5. only then choose the next implementation slice

## Current priority order
1. strengthen connector traceability / lineage across connector runs, approvals, and tasks
2. continue improving task/approval operator clarity
3. preserve the stronger onboarding → workforce blueprint → launch flow
4. keep connector expansion narrow until the shell is stronger
5. keep handoff / memory / roadmap discipline strict

## Guardrails
- Keep GitHub as source of truth
- Preserve the correct Vercel project: `athletics-ai-workforce-web`
- Prefer live-production verification over assumptions
- Prefer data-aware tests over static seeded-ID assumptions
- Do not modify the KSU CSOS codebase directly
