#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-https://api.iai.one}"
ADMIN_SECRET="${IAI_ADMIN_SECRET:-}"
MODE="${MODE:-run}" # run|dry-run

if [ -z "$ADMIN_SECRET" ]; then
  echo "Missing IAI_ADMIN_SECRET env var"
  exit 1
fi

auth_header=( -H "Authorization: Bearer ${ADMIN_SECRET}" )

payload_file="${1:-docs/ops/scripts/migration_items.sample.json}"
if [ ! -f "$payload_file" ]; then
  echo "Payload file not found: $payload_file"
  exit 1
fi

echo "==> Preflight migration health"
curl -sS "${API_BASE}/v1/migration/health" "${auth_header[@]}" | tee /tmp/migration_health_run.json
echo

if [ "$MODE" = "dry-run" ]; then
  echo "==> Dry run mode: POST requests will be sent with dry_run=true"
fi

python3 - "$payload_file" <<'PY'
import json, os, subprocess, sys

api = os.environ.get('API_BASE', 'https://api.iai.one')
secret = os.environ['IAI_ADMIN_SECRET']
mode = os.environ.get('MODE', 'run')
payload_file = sys.argv[1]

with open(payload_file, 'r', encoding='utf-8') as f:
    items = json.load(f)

results = []

for i, item in enumerate(items, start=1):
    source_system = item.get('source_system')
    source_content_id = item.get('source_content_id')
    title = item.get('title')

    rec = {
        'index': i,
        'source_system': source_system,
        'source_content_id': source_content_id,
        'title': title,
        'mode': mode,
    }

    request_item = dict(item)
    if mode == 'dry-run':
        request_item['dry_run'] = True

    p = subprocess.run([
        'curl', '-sS', '-X', 'POST', f'{api}/v1/migration/legacy-content/upsert',
        '-H', 'Content-Type: application/json',
        '-H', f'Authorization: Bearer {secret}',
        '--data', json.dumps(request_item, ensure_ascii=False),
    ], capture_output=True, text=True)

    rec['http_exit_code'] = p.returncode
    if p.stderr.strip():
        rec['stderr'] = p.stderr.strip()

    body = p.stdout.strip()
    rec['raw'] = body
    try:
        parsed = json.loads(body)
        rec['ok'] = parsed.get('ok')
        rec['dry_run'] = parsed.get('dry_run', bool(request_item.get('dry_run')))
        rec['action'] = parsed.get('action')
        rec['error'] = parsed.get('error')
        rec['item'] = parsed.get('item')
    except Exception:
        rec['ok'] = False
        rec['error'] = 'Invalid JSON response'

    results.append(rec)

summary = {
    'total': len(results),
    'success': sum(1 for r in results if r.get('ok') is True),
    'failed': sum(1 for r in results if r.get('ok') is False),
    'dry_run_requests': sum(1 for r in results if r.get('dry_run') is True),
    'results': results,
}

out = '/tmp/migration_batch_result.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print(json.dumps({'saved': out, 'summary': {k: summary[k] for k in ['total', 'success', 'failed', 'dry_run_requests']}}, ensure_ascii=False))
PY

echo
echo "==> Result file: /tmp/migration_batch_result.json"
