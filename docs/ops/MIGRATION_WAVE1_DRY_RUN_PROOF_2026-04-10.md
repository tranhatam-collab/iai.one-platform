# MIGRATION_WAVE1_DRY_RUN_PROOF_2026-04-10

Date: 2026-04-10  
Environment: local worker (`wrangler dev --env dev --local --port 8787`)  
Manifest: `docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json`

## Command

```bash
API_BASE=http://127.0.0.1:8787 \
IAI_ADMIN_SECRET=local-admin-secret \
MODE=dry-run \
PROOF_OUT=docs/ops/MIGRATION_WAVE1_DRY_RUN_PROOF.json \
bash docs/ops/scripts/migration_wave1_manifest_runner.sh docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json
```

## Result Summary

- Contract endpoint: `ok = true`, `version = 2026-04-09-pr06`
- Users dry-run: `total = 12`, `success = 12`, `failed = 0`
- Content dry-run: `total = 12`, `success = 12`, `failed = 0`
- Audit snapshot: `dry_run_items = 48`
- Operations observed: `legacy-users-upsert`, `legacy-content-upsert`

## Evidence Files

- `docs/ops/MIGRATION_WAVE1_DRY_RUN_PROOF.json`
- `/tmp/migration_users_batch_result.json`
- `/tmp/migration_batch_result.json`
