#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://127.0.0.1:8787}"
ADMIN_SECRET="${IAI_ADMIN_SECRET:-}"
MODE="${MODE:-dry-run}" # dry-run|run
MANIFEST_FILE="${1:-docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json}"
PROOF_OUT="${PROOF_OUT:-/tmp/migration_wave1_${MODE}_proof.json}"

if [ -z "$ADMIN_SECRET" ]; then
  echo "Missing IAI_ADMIN_SECRET env var"
  exit 1
fi

if [ ! -f "$MANIFEST_FILE" ]; then
  echo "Manifest file not found: $MANIFEST_FILE"
  exit 1
fi

tmp_users="/tmp/migration_wave1_users_$$.json"
tmp_content="/tmp/migration_wave1_content_$$.json"
tmp_contract="/tmp/migration_wave1_contract_$$.json"
tmp_audit="/tmp/migration_wave1_audit_$$.json"

cleanup() {
  rm -f "$tmp_users" "$tmp_content" "$tmp_contract" "$tmp_audit"
}
trap cleanup EXIT

echo "==> Parse manifest into batch payload files"
python3 - "$MANIFEST_FILE" "$tmp_users" "$tmp_content" <<'PY'
import json, sys

manifest_file, users_out, content_out = sys.argv[1], sys.argv[2], sys.argv[3]

with open(manifest_file, "r", encoding="utf-8") as f:
    manifest = json.load(f)

if not isinstance(manifest.get("users"), list) or len(manifest["users"]) == 0:
    raise SystemExit("manifest.users must be a non-empty array")
if not isinstance(manifest.get("content_items"), list) or len(manifest["content_items"]) == 0:
    raise SystemExit("manifest.content_items must be a non-empty array")

with open(users_out, "w", encoding="utf-8") as f:
    json.dump(manifest["users"], f, ensure_ascii=False, indent=2)

with open(content_out, "w", encoding="utf-8") as f:
    json.dump(manifest["content_items"], f, ensure_ascii=False, indent=2)

print(json.dumps({
    "users": len(manifest["users"]),
    "content_items": len(manifest["content_items"])
}, ensure_ascii=False))
PY

echo
echo "==> Run users batch (${MODE})"
API_BASE="$API_BASE" IAI_ADMIN_SECRET="$ADMIN_SECRET" MODE="$MODE" \
  bash docs/ops/scripts/bulk_legacy_users_upsert.sh "$tmp_users"

echo
echo "==> Run content batch (${MODE})"
API_BASE="$API_BASE" IAI_ADMIN_SECRET="$ADMIN_SECRET" MODE="$MODE" \
  bash docs/ops/scripts/migration_import_batch.sh "$tmp_content"

echo
echo "==> Fetch migration contract and audit snapshots"
curl -sS "${API_BASE}/v1/migration/contracts" > "$tmp_contract"
curl -sS "${API_BASE}/v1/migration/audit-events?limit=200" \
  -H "Authorization: Bearer ${ADMIN_SECRET}" > "$tmp_audit"

python3 - "$MANIFEST_FILE" "$PROOF_OUT" "$tmp_contract" "$tmp_audit" <<'PY'
import json, os, sys
from datetime import datetime, timezone

manifest_file, proof_out, contract_file, audit_file = sys.argv[1:5]

with open(manifest_file, "r", encoding="utf-8") as f:
    manifest = json.load(f)
with open("/tmp/migration_users_batch_result.json", "r", encoding="utf-8") as f:
    users = json.load(f)
with open("/tmp/migration_batch_result.json", "r", encoding="utf-8") as f:
    content = json.load(f)
with open(contract_file, "r", encoding="utf-8") as f:
    contract = json.load(f)
with open(audit_file, "r", encoding="utf-8") as f:
    audit = json.load(f)

def pick_summary(payload):
    if isinstance(payload, dict) and isinstance(payload.get("summary"), dict):
        return payload["summary"]
    if isinstance(payload, dict):
        keys = ("total", "success", "failed", "dry_run_requests")
        return {k: payload.get(k) for k in keys if k in payload}
    return {}

audit_items = audit.get("items", []) if isinstance(audit, dict) else []
dry_run_events = [x for x in audit_items if x.get("dry_run") in (1, True)]

proof = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "mode": os.environ.get("MODE", "dry-run"),
    "api_base": os.environ.get("API_BASE"),
    "manifest": {
        "wave_id": manifest.get("wave_id"),
        "manifest_version": manifest.get("manifest_version"),
        "users": len(manifest.get("users", [])),
        "content_items": len(manifest.get("content_items", [])),
        "redirects": len(manifest.get("redirect_map", [])),
    },
    "contract": {
        "ok": contract.get("ok"),
        "version": contract.get("version"),
        "routes": len(contract.get("routes", [])) if isinstance(contract.get("routes"), list) else 0,
    },
    "users_result": pick_summary(users),
    "content_result": pick_summary(content),
    "audit_snapshot": {
        "items": len(audit_items),
        "dry_run_items": len(dry_run_events),
        "operations": sorted({x.get("operation") for x in audit_items if x.get("operation")}),
    },
}

with open(proof_out, "w", encoding="utf-8") as f:
    json.dump(proof, f, ensure_ascii=False, indent=2)

print(json.dumps({"saved": proof_out, "summary": proof}, ensure_ascii=False))
PY

echo
echo "==> Proof artifact: ${PROOF_OUT}"
