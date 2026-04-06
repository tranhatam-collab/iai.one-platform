# NFT_PUBLISH_PLAYBOOK_ONE_PAGE

Date: 2026-04-06
Audience: Content Team, Ops Team
Purpose: certify every bài/ảnh/sản phẩm số before publish

## 1. Golden Rule

Không publish public content khi chưa có verify record từ `nft.iai.one`.

Mandatory sequence:

1. issuance-preview
2. approve-issuance
3. issue
4. verify
5. publish content with verify URL

## 2. Required Input (must-have)

For every issuance payload, required fields are:

- `contentHash` (SHA-256 or canonical hash)
- `proofUrl` (public document/evidence URL)
- `walletAddress` (recipient wallet)
- `collection` (approved collection slug)

Recommended additional fields:

- subject/recipient display name
- external reference ID
- canonical source URL
- language tag

## 3. Operational Steps

## Step A — Preview

- Call: `POST /api/issuance-preview`
- Check output metadata and mint-readiness
- If failed -> do not continue

## Step B — Approval

- Call: `POST /api/approve-issuance`
- Ensure approval status is valid
- If rejected -> fix payload, restart from preview

## Step C — Issue

- Call: `POST /api/issue`
- Capture issuance artifacts:
  - token ID
  - tx hash
  - metadata URL

## Step D — Verify

- Call: `GET /api/verify?q=<token|hash|externalId>`
- Confirm record is publicly retrievable

## Step E — Audit

- Call: `GET /api/audit?q=<token|externalId>`
- Confirm event chain includes preview, approval, issue

## Step F — Publish

Before publish, attach to the content item:

- verify URL
- audit URL
- proof URL
- content hash

## 4. Public Verify SLA (Required)

SLA target before publish:

- verify URL available within **<= 2 minutes** after successful issue
- audit trail available within **<= 5 minutes**

SLA operating rule:

- If verify URL is not available in SLA window -> **hold publish**
- If audit trail is incomplete -> **hold publish**

## 5. Publish Gate Checklist (per item)

- [ ] `contentHash` exists and matches source
- [ ] `proofUrl` exists and is reachable
- [ ] `walletAddress` validated
- [ ] `collection` approved
- [ ] preview succeeded
- [ ] approval succeeded
- [ ] issue succeeded
- [ ] verify URL resolves publicly
- [ ] audit URL resolves publicly
- [ ] publish includes verify reference

## 6. Failure Handling

If issue was wrong:

- use revoke flow (`/api/revoke-issuance`) for invalid issuance
- use supersede flow (`/api/supersede-issuance`) for corrected replacement

Never silently overwrite public proof without explicit revoke/supersede history.
