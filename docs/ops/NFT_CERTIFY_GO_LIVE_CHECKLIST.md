# NFT_CERTIFY_GO_LIVE_CHECKLIST

Date: 2026-04-06
Scope: `nft.iai.one` certify-before-publish flow
Priority: P0

## 1. Current Production Reality (Confirmed)

Live endpoint checks:

- `GET https://nft.iai.one/api/health` -> `200 OK`
- `GET https://nft.iai.one/api/verify?q=test` -> `200 OK`
- `GET https://nft.iai.one/api/collections?lang=en` -> `200 OK`

Health response currently reports `liveMint.configured = false` with missing:

- `MINT_RPC_URL`
- `MINT_CONTRACT_ADDRESS`
- `MINT_SIGNER_PRIVATE_KEY`

Endpoint list confirms flow surface exists:

- `/api/issuance-preview`
- `/api/approve-issuance`
- `/api/issue`
- `/api/verify`
- `/api/audit`
- `/api/revoke-issuance`
- `/api/supersede-issuance`

## 2. 24h Go-Live Checklist

## A. Secrets and Mint Runtime

- [ ] Set Pages secret: `MINT_RPC_URL`
- [ ] Set Pages secret: `MINT_CONTRACT_ADDRESS`
- [ ] Set Pages secret: `MINT_SIGNER_PRIVATE_KEY`
- [ ] Set Pages secret: `MINT_CONTRACT_ABI_JSON`
- [ ] Optional: set chain/function overrides if contract requires non-default call
- [ ] Redeploy `nft-iai-one` after secrets update
- [ ] Re-check `GET /api/health` until `liveMint.configured = true`

## B. End-to-End Issuance Test (1 real asset)

Use one real, production-safe test asset with real proof URL and recipient wallet.

- [ ] Step 1: `POST /api/issuance-preview`
- [ ] Step 2: `POST /api/approve-issuance`
- [ ] Step 3: `POST /api/issue`
- [ ] Step 4: `GET /api/verify?q=<token|hash|id>`
- [ ] Step 5: `GET /api/audit?q=<token|id>`
- [ ] Capture token ID, tx hash, metadata URL, verify URL, audit URL

## C. Publish Readiness for Content/Ops

- [ ] One-page playbook delivered to Content/Ops
- [ ] Required input fields locked (no optional confusion)
- [ ] Verify URL pattern standardized
- [ ] SLA for verification-before-publish approved

## D. Failure Safeguards

- [ ] Revoke path verified (`/api/revoke-issuance`)
- [ ] Supersede path verified (`/api/supersede-issuance`)
- [ ] Incident escalation owner assigned

## 3. Fast Verification Commands

```bash
curl -sS https://nft.iai.one/api/health
curl -sS "https://nft.iai.one/api/verify?q=<query>"
curl -sS "https://nft.iai.one/api/audit?q=<query>"
```

Recommended success signals:

- `health.issuance.liveMint.configured = true`
- `issue` returns token + contract metadata
- `verify` resolves the issued record
- `audit` shows a full traceable event chain

## 4. Go/No-Go Rule

Go-live for certify-before-publish is `GO` only if all are true:

- [ ] mint runtime configured and healthy
- [ ] one real end-to-end issuance succeeded
- [ ] verify URL and audit URL are publicly resolvable
- [ ] playbook delivered and understood by Content/Ops
- [ ] SLA approved

Else: `NO-GO` and keep publish gated.
