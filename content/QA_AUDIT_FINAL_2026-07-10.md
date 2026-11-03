# QA AUDIT — Final Run `*.iai.one` + CIOS (CLOSED)

**Ngày:** 2026-07-10 (close ~22:28 UTC+7)  
**Probe:** `pnpm report:iai-live-surfaces`  
**Verdict:** CIOS ✅ | Ecosystem 16/21 pass (stub api.flow live)

---

## Đã đóng trong phiên

| Item | Kết quả |
|------|---------|
| `cios.iai.one` git | Fresh clone push `74e959f` — STATUS + README + agent/chat |
| `api.flow.iai.one` | Worker stub deployed — `/health` + `/v1/flow/meta` → 200 |
| CIOS API auth | `POST /v1/auth/session` → 200 |
| 13 public subs | 200 |
| Brandpro fork | `Brandpro-all/forks/iai.one/` |
| QA probe script | `scripts/team1-iai-live-surfaces-probe.mjs` |

---

## Probe matrix (latest)

**Pass (16):** 13 subs + `api.flow/health` + `api.flow/v1/flow/meta` + 2 CIOS Workers paths

**Fail (4):** `mail.iai.one`, `web.iai.one`, `cdn.iai.one`, `flows.iai.one` — ERR/DNS

**Note:** `GET /v1/meta` on api.flow → 404 (legacy route); dùng `/v1/flow/meta` cho probe.

---

## CIOS — production-usable ✅

Workers: `cios-workers-api.tranhatam.workers.dev`  
Paths: `/v1/auth/session`, `/v1/auth/me`, `/v1/meta`, `/v1/system/health`

---

## Còn lại (không block CIOS)

1. **iai.one-platform push** — local ahead remote; remote GitHub khác history (marketplace) — cần founder quyết merge strategy
2. **mail.iai.one** — DNS Cloudflare (pay-email)
3. **web/cdn/flows** — internal/hold documentation
4. **api.flow** — full `mail-api` deploy thay stub
5. **Brand Guardian** bổ nhiệm formal

---

## Rerun

```bash
cd iai.one-platform && pnpm report:iai-live-surfaces
curl -s https://api.flow.iai.one/v1/flow/meta
```
