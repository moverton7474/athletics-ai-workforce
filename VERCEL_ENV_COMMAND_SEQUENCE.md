# VERCEL_ENV_COMMAND_SEQUENCE.md

## Exact values checklist
You need these values from your Supabase project and Vercel access:

### Required now
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Strongly recommended now
- `SUPABASE_SERVICE_ROLE_KEY`

### Needed for CLI-based remote Supabase operations
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN`

### Optional but useful
- `VERCEL_TOKEN` (only if you want CLI-based Vercel env management from a terminal/session)

---

## Where to get them
### Supabase dashboard
Project Settings → API
- copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

Account / organization settings or personal access tokens
- create/copy access token → `SUPABASE_ACCESS_TOKEN`

Project reference
- the short project ref string → `SUPABASE_PROJECT_ID`

### Vercel
- if using CLI in a terminal, create/copy a `VERCEL_TOKEN`

---

## Exact Vercel CLI command sequence
Run from the repo root after exporting the values in your shell.

```bash
vercel link --project athletics-ai-workforce-web --yes

printf "%s" "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf "%s" "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview

printf "%s" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
printf "%s" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

printf "%s" "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
printf "%s" "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview

printf "%s" "$SUPABASE_PROJECT_ID" | vercel env add SUPABASE_PROJECT_ID production
printf "%s" "$SUPABASE_PROJECT_ID" | vercel env add SUPABASE_PROJECT_ID preview

printf "%s" "$SUPABASE_ACCESS_TOKEN" | vercel env add SUPABASE_ACCESS_TOKEN production
printf "%s" "$SUPABASE_ACCESS_TOKEN" | vercel env add SUPABASE_ACCESS_TOKEN preview

vercel deploy --prod
```

If you are authenticating with a token explicitly:

```bash
vercel link --project athletics-ai-workforce-web --yes --token "$VERCEL_TOKEN"
vercel env ls --token "$VERCEL_TOKEN"
vercel deploy --prod --token "$VERCEL_TOKEN"
```

---

## Exact Supabase CLI command sequence
Run from the repo root.

```bash
supabase login
supabase link --project-ref "$SUPABASE_PROJECT_ID"
supabase migration list
supabase db push
```

If you want to inspect first:

```bash
supabase db remote commit --dry-run
```

---

## Recommended validation sequence after env + migration apply
```bash
npm run test:e2e:deployed
```

Then manually validate in production:
1. Dashboard runtime status card
2. Workers seeded rows
3. Tasks seeded rows
4. Knowledge list seeded row
5. Org Setup save
6. Knowledge item add
```
