# NFT Certify Payload Pack

Use this folder to run certify-before-publish E2E quickly.

## Files

- `editorial-preview.json`
- `illustration-preview.json`
- `digital-product-preview.json`
- `submit-approval-template.json`
- `approve-template.json`
- `issue-template.json`

## Quick Sequence

1. `POST /api/issuance-preview` with one `*-preview.json`
2. `POST /api/approve-issuance` with `submit-approval-template.json`
3. `POST /api/approve-issuance` with `approve-template.json`
4. `POST /api/issue` with `issue-template.json`
5. `GET /api/verify?q=...`
6. `GET /api/audit?q=...`

## Important

- Replace collection slugs if your live catalog differs.
- Keep `contentHash` in `sha256:<hex>` format.
- Do not publish before verify/audit URLs resolve publicly.
