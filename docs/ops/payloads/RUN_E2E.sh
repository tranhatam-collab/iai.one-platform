#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://nft.iai.one}"

if [ "$#" -lt 1 ]; then
  echo "Usage: BASE_URL=https://nft.iai.one $0 <preview-json-file>"
  echo "Example: $0 docs/ops/payloads/editorial-preview.json"
  exit 1
fi

PREVIEW_FILE="$1"

echo "==> 1) issuance-preview"
curl -sS -X POST "$BASE_URL/api/issuance-preview" \
  -H "Content-Type: application/json" \
  -d @"$PREVIEW_FILE"
echo
echo

echo "==> 2) submit approval (edit submit-approval-template.json first)"
curl -sS -X POST "$BASE_URL/api/approve-issuance" \
  -H "Content-Type: application/json" \
  -d @"docs/ops/payloads/submit-approval-template.json"
echo
echo

echo "==> 3) approve (edit approve-template.json first)"
curl -sS -X POST "$BASE_URL/api/approve-issuance" \
  -H "Content-Type: application/json" \
  -d @"docs/ops/payloads/approve-template.json"
echo
echo

echo "==> 4) issue (edit issue-template.json first)"
curl -sS -X POST "$BASE_URL/api/issue" \
  -H "Content-Type: application/json" \
  -d @"docs/ops/payloads/issue-template.json"
echo
echo

echo "==> 5) verify"
echo "curl -sS \"$BASE_URL/api/verify?q=<token_or_externalId>\""

echo "==> 6) audit"
echo "curl -sS \"$BASE_URL/api/audit?q=<token_or_externalId>\""
