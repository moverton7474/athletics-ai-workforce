# NEXT_SESSION_BOOTSTRAP.md

## Mandatory startup order for the next session

Before any new implementation or planning work, read these in this exact order:

1. `/data/.openclaw/workspace/MEMORY.md` **fully, end to end, every word**
2. `SESSION_HANDOFF_2026-04-09_FINAL.md` **fully, end to end**
3. `ROADMAP.md`
4. `VOICE_ROUTE_STATE_CONTRACTS.md`
5. `PRODUCT_DESCRIPTION.md`
6. `SESSION_HANDOFF_2026-04-09_END_OF_SESSION.md`
7. `SESSION_HANDOFF_2026-04-08_EVENING.md`
8. `SESSION_HANDOFF_2026-04-07_LATE.md`
9. `NEW_SESSION_HANDOFF.md`
10. `VOICE_FIRST_INTEGRATION_PLAN.md`
11. `THREE_PILLARS_ALIGNMENT.md`
12. `CSOS_ADAPTER_SPEC.md`

Do not start coding or planning before that reading sequence is complete.

## Mandatory validation sequence
After the docs review and before new work:

1. confirm current branch + `git status --short`
2. confirm GitHub is the source of truth and local repo is up to date
3. confirm live production URL is still `https://athletics-ai-workforce-web.vercel.app`
4. rerun Playwright smoke against production
5. only then begin the next planning task

## Explicit next-session mission
The next session should execute this planning step:

1. define a **route inventory table**
2. define a **typed state contract spec**
3. define a **voice-command → route/state mapping table**
4. define **manual fallback behavior** for each of the first 3 voice-complete workflows

Stay in planning mode for the voice-complete MVP. Do **not** begin broad voice-layer implementation yet.

## Current priority order
1. route inventory for segment discovery, campaign builder, asset review, approvals, and follow-up
2. typed state contracts for segment → builder → review → approval → follow-up
3. voice/manual parity mapping for the first 3 voice-complete workflows
4. preserve the stronger onboarding → workforce blueprint → workflow shell already live
5. keep GitHub / handoff / memory continuity discipline strict

## Guardrails
- Keep GitHub as source of truth
- Preserve the correct Vercel project: `athletics-ai-workforce-web`
- Prefer live-production verification over assumptions
- Prefer data-aware tests over static seeded-ID assumptions
- Do not modify the KSU CSOS codebase directly
- Keep the shell primary; voice is an entry path into the shell, not a separate app
