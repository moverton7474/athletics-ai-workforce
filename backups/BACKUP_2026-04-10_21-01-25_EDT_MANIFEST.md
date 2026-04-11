# BACKUP_2026-04-10_21-01-25_EDT_MANIFEST.md

## Backup scope
Repository: `athletics-ai-workforce`
GitHub source of truth: `moverton7474/athletics-ai-workforce`
Branch: `main`
Latest committed repo state at backup time: `938d783bbd9be3a680f766ad89b70e20b944f2c1`
Primary late-session handoff: `SESSION_HANDOFF_2026-04-10_LATE.md`

## Files created
### Local archive backup
- `athletics-ai-workforce/backups/athletics-ai-workforce_backup_2026-04-10_21-01-25_EDT.tar.gz`
- SHA-256: `f4f4b36312c2e25fc08d4009c1f75396f0d7cca141523ea46d8e703cf5f0db73`

Note: the tarball intentionally excludes `athletics-ai-workforce/backups/` to avoid recursively packing backup artifacts into themselves.

### Local git bundle backup
- `athletics-ai-workforce/backups/athletics-ai-workforce_repo_2026-04-10_21-01-25_EDT.bundle`
- SHA-256: `2ac4eb8a2e378c305b66c48f6bc4278de87dceeb2dc6b852d5ebfd16190db3cf`

## Restore references
### Restore from tarball
From `/data/.openclaw/workspace`:
```bash
tar -xzf athletics-ai-workforce/backups/athletics-ai-workforce_backup_2026-04-10_21-01-25_EDT.tar.gz
```

### Restore from git bundle
```bash
git clone athletics-ai-workforce/backups/athletics-ai-workforce_repo_2026-04-10_21-01-25_EDT.bundle athletics-ai-workforce-restored
```

## Continuity docs to read first next session
1. `/data/.openclaw/workspace/MEMORY.md`
2. `athletics-ai-workforce/SESSION_HANDOFF_2026-04-10_LATE.md`
3. `athletics-ai-workforce/ROADMAP.md`
4. `athletics-ai-workforce/ROUTE_ADOPTION_MAP_VISIONARY_CSOS.md`
5. `athletics-ai-workforce/NEXT_SESSION_BOOTSTRAP.md`

## Important note
- The actual tarball + bundle backups were created from committed repo state `938d783`.
- If another tiny continuity/manifest commit is made after this file is written, GitHub latest may advance beyond the artifact base commit.
- In that case:
  - GitHub latest continuity refs will point to the post-manifest commit
  - backup artifact base commit remains `938d783`
