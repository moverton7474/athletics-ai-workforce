# NEXT_SESSION_BOOTSTRAP.md

## Mandatory startup order for the next session

Before any new implementation or planning work, read these in this exact order:

1. `/data/.openclaw/workspace/MEMORY.md` **fully, end to end, every word**
2. `SESSION_HANDOFF_2026-04-09_LATE_FINAL.md` **fully, end to end**
3. `ROADMAP.md`
4. `VOICE_ROUTE_STATE_CONTRACTS.md`
5. `PRODUCT_DESCRIPTION.md`
6. `SESSION_HANDOFF_2026-04-09_FINAL.md`
7. `SESSION_HANDOFF_2026-04-09_END_OF_SESSION.md`
8. `SESSION_HANDOFF_2026-04-08_EVENING.md`
9. `SESSION_HANDOFF_2026-04-07_LATE.md`
10. `NEW_SESSION_HANDOFF.md`
11. `VOICE_FIRST_INTEGRATION_PLAN.md`
12. `THREE_PILLARS_ALIGNMENT.md`
13. `CSOS_ADAPTER_SPEC.md`

Do not start coding or planning before that reading sequence is complete.

## Mandatory validation sequence
After the docs review and before new work:

1. confirm current branch + `git status --short`
2. confirm GitHub is the source of truth and local repo is up to date
3. confirm live production URL is still `https://athletics-ai-workforce-web.vercel.app`
4. rerun Playwright smoke against production
5. only then begin the next planning task

## Explicit next-session mission
The next session should treat the current 5-ticket Phase 2.3 / early Phase 1.5 slice as complete and then do this:

1. verify the latest production deploy for the final workflow-spine + CSOS-read + entry-context work
2. rerun high-value Playwright smoke against live production
3. decide whether to begin:
   - worker/workspace product-quality hardening, or
   - deeper quality on the single narrow CSOS read path
4. avoid broad connector sprawl unless explicitly directed

## Current priority order
1. keep the campaign workflow spine stable and trustworthy in production
2. preserve shared workflow truth across review / approval / results / follow-up
3. deepen worker/workspace quality next unless Milton explicitly redirects
4. keep CSOS work narrow, read-first, and adapter-backed
5. keep GitHub / handoff / memory continuity discipline strict

## Guardrails
- Keep GitHub as source of truth
- Preserve the correct Vercel project: `athletics-ai-workforce-web`
- Prefer live-production verification over assumptions
- Prefer data-aware tests over static seeded-ID assumptions
- Do not modify the KSU CSOS codebase directly
- Keep the shell primary; voice is an entry path into the shell, not a separate app
