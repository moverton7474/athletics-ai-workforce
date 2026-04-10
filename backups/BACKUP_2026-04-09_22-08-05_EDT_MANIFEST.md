# BACKUP_2026-04-09_22-08-05_EDT_MANIFEST.md

## Backup scope
Repository: `athletics-ai-workforce`
GitHub source of truth: `moverton7474/athletics-ai-workforce`
Branch: `main`
Latest committed repo state at backup time: `350bfeb77e478e8fabc1257a18ca35d4eedfc3f8`
Primary late-session handoff: `SESSION_HANDOFF_2026-04-09_LATE_FINAL.md`

## Files created
### Local archive backup
- `athletics-ai-workforce/backups/athletics-ai-workforce_backup_2026-04-09_22-08-05_EDT.tar.gz`
- SHA-256: `b58c2ec27de6e458189de1109e463886d95ef2a2bbef269c8db0048103990eba`

Note: the tarball intentionally excludes `athletics-ai-workforce/backups/` to avoid recursively packing backup artifacts into themselves.

### Local git bundle backup
- `athletics-ai-workforce/backups/athletics-ai-workforce_repo_2026-04-09_22-08-05_EDT.bundle`
- SHA-256: `57608bdc010426cd2409983ee1e46792e0396a40342f2245c98b20037093d0b8`

## Restore references
### Restore from tarball
From `/data/.openclaw/workspace`:
```bash
tar -xzf athletics-ai-workforce/backups/athletics-ai-workforce_backup_2026-04-09_22-08-05_EDT.tar.gz
```

### Restore from git bundle
```bash
git clone athletics-ai-workforce/backups/athletics-ai-workforce_repo_2026-04-09_22-08-05_EDT.bundle athletics-ai-workforce-restored
```

## Continuity docs to read first next session
1. `/data/.openclaw/workspace/MEMORY.md`
2. `athletics-ai-workforce/SESSION_HANDOFF_2026-04-09_LATE_FINAL.md`
3. `athletics-ai-workforce/NEXT_SESSION_BOOTSTRAP.md`
