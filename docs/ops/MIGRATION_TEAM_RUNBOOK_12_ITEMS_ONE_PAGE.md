# MIGRATION_TEAM_RUNBOOK_12_ITEMS_ONE_PAGE

Date: 2026-04-06
Audience: Migration/Ops Team
Scope: 12-item coordinated import (3 PDI stories + 4 PDUS programs + 5 PDUS opportunities)

## 1. Goal

Run idempotent import safely on production without duplicate records and with deterministic content hash references.

## 2. Endpoint Set (idempotent)

- `POST /v1/migration/legacy-users/upsert`
- `POST /v1/migration/legacy-content/upsert`
- `POST /v1/migration/legacy-content/mark-imported-by-source`
- `GET  /v1/migration/health`
- `GET  /v1/migration/legacy-content?status=...`

Admin auth accepted:

- `Authorization: Bearer <IAI_ADMIN_SECRET>`
- `x-iai-admin-secret: <IAI_ADMIN_SECRET>`

## 3. Required Files

- wave-1 manifest schema: `docs/ops/MIGRATION_WAVE1_MANIFEST_SCHEMA.json`
- wave-1 manifest sample: `docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json`
- user-link payload batch: `docs/ops/scripts/legacy_users_12.sample.json`
- content payload batch (edit): `docs/ops/scripts/migration_items.sample.json`
- user upsert runner: `docs/ops/scripts/bulk_legacy_users_upsert.sh`
- content upsert runner: `docs/ops/scripts/migration_import_batch.sh`
- manifest runner (recommended): `docs/ops/scripts/migration_wave1_manifest_runner.sh`

## 4. Preflight (must pass)

```bash
export API_BASE="https://api.iai.one"
export IAI_ADMIN_SECRET="<SECRET>"

curl -sS "$API_BASE/v1/migration/health" \
  -H "Authorization: Bearer $IAI_ADMIN_SECRET"
```

Expected:

- `ok: true`

## 5. Step-by-Step Run (12 items)

## Step A — Upsert 12 user links

Dry run:

```bash
MODE=dry-run docs/ops/scripts/bulk_legacy_users_upsert.sh docs/ops/scripts/legacy_users_12.sample.json
```

Live run:

```bash
MODE=run docs/ops/scripts/bulk_legacy_users_upsert.sh docs/ops/scripts/legacy_users_12.sample.json
```

## Step B — Upsert 12 content items

Edit `migration_items.sample.json` to include full 12 records with deterministic `content_hash`.

Dry run:

```bash
MODE=dry-run docs/ops/scripts/migration_import_batch.sh docs/ops/scripts/migration_items.sample.json
```

Live run:

```bash
MODE=run docs/ops/scripts/migration_import_batch.sh docs/ops/scripts/migration_items.sample.json
```

## Step C — Mark imported by source key

For each imported item, call:

```bash
curl -sS -X POST "$API_BASE/v1/migration/legacy-content/mark-imported-by-source" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $IAI_ADMIN_SECRET" \
  -d '{
    "source_system":"phuongdonginsider",
    "source_content_id":"PDI-STORY-2026-0002",
    "imported_post_id":"<NEW_POST_ID>",
    "imported_by":"<OPERATOR_USER_ID>"
  }'
```

## 6. Deterministic Hash Rule

For each item, hash canonical content payload once and store as:

- `content_hash = sha256:<hex>`

Do not recompute hash with different whitespace/field ordering between preview and import.

## 7. Idempotency Rule

- Re-running upsert with same `source_system + source_content_id` updates record, does not duplicate.
- Re-running user upsert with same source key updates link, does not duplicate.

## 8. One-Command Manifest Run (recommended for PR-07+)

Dry run:

```bash
API_BASE=http://127.0.0.1:8787 \
IAI_ADMIN_SECRET=local-admin-secret \
MODE=dry-run \
PROOF_OUT=/tmp/migration_wave1_dry_run_proof.json \
bash docs/ops/scripts/migration_wave1_manifest_runner.sh docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json
```

Live run:

```bash
API_BASE=https://api.iai.one \
IAI_ADMIN_SECRET="<SECRET>" \
MODE=run \
PROOF_OUT=/tmp/migration_wave1_live_run_proof.json \
bash docs/ops/scripts/migration_wave1_manifest_runner.sh docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json
```

## 9. Output Artifacts

Script output files:

- `/tmp/migration_users_batch_result.json`
- `/tmp/migration_batch_result.json`
- `/tmp/migration_wave1_dry_run_proof.json` (or `PROOF_OUT` custom path)

Team must archive both in release evidence folder.

## 10. Go/No-Go for team handoff

Go only if:

- health OK
- user upsert success = 12/12
- content upsert success = 12/12
- mark-imported-by-source success for all published items
- imported queue reflects expected rows

Else: stop and escalate with failure summary JSON.
