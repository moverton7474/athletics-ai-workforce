# CSOS Bridge Activation Checklist

## Purpose
Turn the first athletics-ai-workforce ↔ KSU CSOS read bridge from fallback mode into live mode.

This checklist covers:
- required environment variables
- activation sequence
- local verification
- production verification
- expected outcomes
- rollback behavior

Current bridge targets:
- `KSU Football Non-Renewals`
- `KSU Football Top Prospects`

---

## Activation Goal
After this checklist is complete, the following routes should pull live CSOS-backed data instead of only seeded fallback state whenever valid CSOS credentials are available:
- `/segments/ksu-football-2026-non-renewals`
- `/segments/ksu-football-top-prospects`

---

## Required Environment Variables

### Existing athletics-ai-workforce envs
These already support the local product database and should remain configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### New CSOS bridge envs
These activate the first live CSOS read bridge.

#### Required for direct-read mode
- `CSOS_ADAPTER_USE_DIRECT_READS=true`
- `CSOS_SUPABASE_URL=<live csos supabase url>`
- `CSOS_SUPABASE_SERVICE_ROLE_KEY=<preferred>`

#### Fallback if service role is not available
- `CSOS_SUPABASE_ANON_KEY=<optional fallback>`

### Notes
- prefer `CSOS_SUPABASE_SERVICE_ROLE_KEY` for the server-side bridge
- do **not** expose CSOS service credentials to the browser
- these vars should be configured in both preview and production if you want both environments to verify live bridge behavior

---

## Recommended Runtime Mode
### MVP recommendation
**Use direct-read mode first**

Why:
- simplest activation path
- no extra bridge service needed yet
- matches the current implementation already merged into athletics-ai-workforce
- fastest way to verify live data retrieval

---

## Setup Steps

### Step 1 — Confirm CSOS credentials
Confirm you have:
- live CSOS Supabase URL
- live CSOS service role key
- or, if necessary, anon key with sufficient read access

### Step 2 — Add envs locally
Set in local runtime or `.env.local` equivalent:
- `CSOS_ADAPTER_USE_DIRECT_READS=true`
- `CSOS_SUPABASE_URL=...`
- `CSOS_SUPABASE_SERVICE_ROLE_KEY=...`

### Step 3 — Add envs to Vercel
In Vercel for `athletics-ai-workforce-web`, add:
- `CSOS_ADAPTER_USE_DIRECT_READS=true`
- `CSOS_SUPABASE_URL=...`
- `CSOS_SUPABASE_SERVICE_ROLE_KEY=...`
- optionally `CSOS_SUPABASE_ANON_KEY=...`

Recommended scope:
- Preview
- Production

### Step 4 — Redeploy
After env updates:
- redeploy preview first
- verify
- then redeploy production

---

## Local Verification Plan

### Verification target routes
1. `/segments/ksu-football-2026-non-renewals`
2. `/segments/ksu-football-top-prospects`
3. `/segments`

### What to look for
#### Non-renewals route
Expect:
- audience count may differ from seeded fallback
- rationale/summary should reflect live CSOS-backed read summary
- source record preview should show real person names instead of only static fallback expectations

#### Top prospects route
Expect:
- audience count should reflect returned prospect list
- rationale should describe CSOS ticket segmentation
- source record preview should show real prospect names

#### Segments list
Expect:
- both segments remain available
- counts/value may update from live read results
- segment shell remains stable even if one bridge call fails

### Failure expectations
If CSOS envs are missing or invalid:
- app should still render
- fallback segment state should remain usable
- workflow shell should not break

---

## Production Verification Plan

### Phase A — Preview deployment
After envs are added to preview:
1. open `/segments`
2. open `/segments/ksu-football-2026-non-renewals`
3. open `/segments/ksu-football-top-prospects`
4. open builder from each route
5. confirm no route regression in the workflow chain

### Phase B — Production deployment
After preview passes:
1. deploy production
2. verify the same routes live
3. verify segment → builder path remains stable
4. verify fallback does not appear to be the only source of truth if live data is expected

---

## Suggested Live Test Script
Use this exact verification sequence after env activation:

1. Open `/segments`
2. Confirm both:
   - `2026 KSU Football Non-Renewals`
   - `KSU Football Top Prospects`
3. Open the non-renewals segment
4. Confirm rationale references CSOS-backed renewal-risk/non-renewal recovery bridge behavior
5. Open the prospects segment
6. Confirm rationale references CSOS-backed prospect segmentation
7. Launch the builder from non-renewals
8. Confirm campaign shell still loads cleanly
9. Launch the builder from top prospects
10. Confirm campaign shell still loads cleanly

---

## Expected MVP Outcome After Activation
Once live bridge activation succeeds, athletics-ai-workforce will be able to:
- use real CSOS-backed cohorts as starting segments
- preserve governance, review, and approval in athletics-ai-workforce
- move toward real ticket-sales workflow execution without duplicating CSOS domain logic

---

## Rollback Behavior
If activation causes issues:

### Fast rollback
Set:
- `CSOS_ADAPTER_USE_DIRECT_READS=false`

Result:
- athletics-ai-workforce returns to stub/fallback segment behavior
- workflow shell remains available
- no need to remove the bridge code itself

---

## Immediate Next Step After Activation
Once live reads are verified, the next move should be:
1. add bridge visibility/provenance messaging if needed
2. decide whether to implement `constituents.search` next or move directly to draft handoff
3. preferably add `constituents.search` first, then `ticketing.outreach.compose`

---

## Decision Rule
Do not move to execution handoff until:
- live read bridge is verified
- operator sees trustworthy cohort data
- approval ownership is confirmed
- production environment stability is confirmed
