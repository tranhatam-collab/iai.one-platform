# Việc cần làm — sau close QA 2026-07-10

## ✅ Đã xong

- [x] CIOS push `74e959f` (STATUS, README, runbook, `/v1/agent/chat`)
- [x] `api.flow.iai.one` stub deployed (`/health`, `/v1/flow/meta`)
- [x] QA probe script + audit report
- [x] Brandpro fork + integration lock

## P0 — Platform git (founder)

Local `iai.one-platform` **không khớp** remote GitHub (remote = marketplace cũ). Cần:

```bash
# Option A: push local branch mới
cd iai.one-platform
git push origin main:iai-one-monorepo-2026-07

# Option B: force push (nguy hiểm — chỉ nếu remote cũ bỏ)
# git push --force-with-lease origin main
```

## P1 — Infra

| Owner | Việc |
|-------|------|
| pay-email | `mail.iai.one` DNS → Cloudflare |
| Team 5 | `web.iai.one` release-hold doc |
| Team B | `cdn` / `flows` internal-only |
| Team 2 | `api.flow` full mail-api thay stub; alias `/v1/meta` |

## P1 — CIOS

| Việc |
|------|
| Dùng folder `cios.iai.one.fresh` hoặc clone mới — bỏ `cios.iai.one.broken*` |
| Verify `AIAGENT_API_KEY` live |

## P2

- Brand Guardian
- Quarterly Brandpro audit
- UI copy audit G3
