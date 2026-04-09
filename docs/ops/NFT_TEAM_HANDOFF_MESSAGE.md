# NFT_TEAM_HANDOFF_MESSAGE

Priority: Critical
Send to teams: NFT, PhuongDong.US, PhuongDongInsider, VC Mirror

## Message (copy-paste)

Team,

From this point onward, every digital asset must be certified on `nft.iai.one` before publish.

This includes:

- editorial articles
- images/illustrations
- digital paid products
- crypto asset disclosures
- release code bundles (when applicable)

Hard rule:

- No verify URL => No publish.

Mandatory content flow:

1) `POST /api/issuance-preview`
2) `POST /api/approve-issuance` (submit)
3) `POST /api/approve-issuance` (approve)
4) `POST /api/issue`
5) `GET /api/verify?q=...`
6) `GET /api/audit?q=...`

Mandatory crypto-asset 2-step:

1) register + auto-check on NFT layer (`/api/asset-registrations`)
2) independent VC mirror verification (`vc.vetuong.com` / `vc.vetuonglai.com`)

Required publish inputs:

- `contentHash`
- `proofUrl`
- `walletAddress`
- `collection`

SLA before publish:

- verify URL live <= 2 minutes
- audit URL live <= 5 minutes

If SLA is not met, publish must be blocked.

Immediate action (24h):

- NFT team: set mint secrets and confirm `liveMint.configured = true` on `/api/health`
- Publisher teams: enforce pre-publish gate in CMS/editor flow
- VC team: ensure mirror endpoint resolves the same registry state

Reference docs:

- `docs/ops/NFT_CERTIFY_GO_LIVE_CHECKLIST.md`
- `docs/ops/NFT_PUBLISH_PLAYBOOK_ONE_PAGE.md`
- `docs/ops/NFT_CRITICAL_ENFORCEMENT_PLAN_PDI_PDUS_VC.md`
- `docs/ops/payloads/*`
