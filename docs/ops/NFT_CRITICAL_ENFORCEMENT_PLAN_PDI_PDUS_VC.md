# NFT_CRITICAL_ENFORCEMENT_PLAN_PDI_PDUS_VC

Date: 2026-04-06
Priority: P0 (must-go-first)
Scope:

- `nft.iai.one`
- `phuongdong.us`
- `phuongdonginsider.com`
- `vc.vetuong.com` / `vc.vetuonglai.com` mirror verification

## 1. Non-Negotiable Policy

From now on, every digital asset (article, image, digital product, disclosure artifact, and release code bundle) must pass NFT certify flow before public publish.

Hard rule:

- No verify URL -> No publish.

## 2. Mandatory Certification Flow (Content)

For each content item from `phuongdong.us` and `phuongdonginsider.com`:

1. `POST /api/issuance-preview`
2. `POST /api/approve-issuance` (submit)
3. `POST /api/approve-issuance` (approve)
4. `POST /api/issue`
5. `GET /api/verify?q=...`
6. `GET /api/audit?q=...`
7. Publish only after verify/audit URLs resolve publicly

Required fields:

- `contentHash`
- `proofUrl`
- `walletAddress`
- `collection`

## 3. Mandatory 2-Step Flow (Crypto Asset Registration + VC Mirror)

For wallet/contract/token assets:

Step 1: register + auto-check on NFT trust layer

- `POST /api/asset-registrations`
- include chain/network, wallet, contract/token when applicable, `proofUrl`, `contentHash`

Step 2: independent verification mirror on VC surface

- record must carry `mirrorCode` or equivalent VC reference
- VC endpoint must resolve and show same registry reference

Go-live condition for crypto assets:

- asset has NFT registry URL
- asset has VC mirror URL
- both URLs resolve publicly

## 4. Enforcement Gates For Publisher Systems

Both sites (`phuongdong.us`, `phuongdonginsider.com`) must enforce pre-publish gate:

- Gate A: hash + proof generated
- Gate B: issue completed
- Gate C: verify URL alive
- Gate D: audit URL alive

Publisher UI must display:

- verify URL
- audit URL
- token ID
- tx hash (if on-chain issuance)

## 5. SLA (Public Verification)

Required SLA before publish:

- verify URL available <= 2 minutes after issue
- audit URL available <= 5 minutes after issue

If SLA fails:

- block publish
- create incident ticket

## 6. Security Requirement (including source code artifacts)

If code bundles are also certified as digital assets:

- hash source bundle (`sha256`)
- store proof URL (release manifest, commit, CI artifact)
- issue NFT record with content hash + release reference
- verify link must be attached to release note

Note:

- NFT certification is proof/provenance layer, not encryption at rest by itself.
- If encryption is required, keep encryption keys and encrypted artifact flow in existing security stack, then certify encrypted artifact hash via NFT flow.

## 7. Team Delivery Checklist (24h)

## Team NFT / Trust Layer

- [ ] set all mint secrets (`MINT_RPC_URL`, `MINT_CONTRACT_ADDRESS`, `MINT_SIGNER_PRIVATE_KEY`, `MINT_CONTRACT_ABI_JSON`)
- [ ] confirm `liveMint.configured = true` on `/api/health`
- [ ] run 1 real E2E issuance per content type

## Team phuongdong.us

- [ ] add publish gate API calls to `nft.iai.one`
- [ ] block publish if verify/audit unavailable
- [ ] persist verify/audit URLs with each published item

## Team phuongdonginsider.com

- [ ] same gate integration as above
- [ ] enforce required input fields before editor can click publish

## Team VC Mirror (`vc.vetuong.com` / `vc.vetuonglai.com`)

- [ ] accept mirror code/registry mapping
- [ ] expose independent public verify view
- [ ] return consistent state with NFT registry

## 8. Final Go/No-Go

Go only when all are true:

- [ ] mint runtime configured
- [ ] content E2E (preview->approval->issue->verify->audit) passes
- [ ] crypto asset 2-step (NFT register + VC mirror) passes
- [ ] publishers enforce hard pre-publish gate

Else: NO-GO.
