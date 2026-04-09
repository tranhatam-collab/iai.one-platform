# MIGRATION_WAVE1_SIGNOFF_CHECKLIST

Date: 2026-04-10  
Owner: Migration + Backend + QA  
Scope: PR-07 legacy migration wave 1 readiness gate

## 1. Required Inputs

- [ ] Manifest file locked: `docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json` (or approved replacement)
- [ ] Manifest shape validated against `docs/ops/MIGRATION_WAVE1_MANIFEST_SCHEMA.json`
- [ ] User inventory count confirmed
- [ ] Content inventory count confirmed
- [ ] Redirect map count confirmed
- [ ] Collision + trust + moderation rule pack approved by migration owner

## 2. Dry-Run Proof Gate (must be green)

- [ ] Local or preview API health returns `ok: true`
- [ ] `GET /v1/migration/contracts` returns `ok: true` and PR-06 contract version
- [ ] `MODE=dry-run` users upsert summary: `failed = 0`
- [ ] `MODE=dry-run` content upsert summary: `failed = 0`
- [ ] Audit events include dry-run records for `legacy-users-upsert` and `legacy-content-upsert`
- [ ] Proof artifact JSON generated and archived

Recommended command:

```bash
API_BASE=http://127.0.0.1:8787 \
IAI_ADMIN_SECRET=local-admin-secret \
MODE=dry-run \
PROOF_OUT=docs/ops/MIGRATION_WAVE1_DRY_RUN_PROOF.json \
bash docs/ops/scripts/migration_wave1_manifest_runner.sh docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json
```

## 3. Import-Ready Go/No-Go

Go only when all are true:

- [ ] Dry-run gate is green
- [ ] Source inventory is frozen for this wave
- [ ] Redirect plan reviewed by web owner
- [ ] Rollback owner assigned
- [ ] Operator and approver are different people
- [ ] Production run window confirmed

No-Go if any are true:

- [ ] Any dry-run failure
- [ ] Missing trust proof (`content_hash` or `proof_url`) for required content
- [ ] Unresolved identity collision
- [ ] Redirect map unresolved

## 4. Approval Signatures

- Migration owner: _____________________ Date: __________
- Backend owner: _______________________ Date: __________
- QA owner: ____________________________ Date: __________
- Release owner: _______________________ Date: __________
