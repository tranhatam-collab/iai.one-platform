# Sổ đăng ký bề mặt live — QA `*.iai.one`

**Phiên bản:** 1.1  
**Kiểm chứng lần cuối:** 2026-07-10  
**Phương pháp probe:** `curl -L --max-time 12`  
**Chuẩn ngôn ngữ:** `content/iai-language-standard-lock.md`  
**Brandpro fork:** `Brandpro-all/forks/iai.one/` + `content/iai-brandpro-integration-lock.md`  
**Khóa path auth:** chỉ được báo cáo `/v1/auth/*` — không được viết `/auth` hoặc `/me` thiếu tiền tố.

Tài liệu này là sự thật vận hành về trạng thái HTTP của các bề mặt `*.iai.one`. Mọi báo cáo QA và handoff dev phải bám bảng này và khóa path.

---

## English reference

**Version:** 1.1  
**Last verified:** 2026-07-10  
**Probe method:** `curl -L --max-time 12`  
**Language authority:** `content/iai-language-standard-lock.md`  
**Brandpro fork:** `Brandpro-all/forks/iai.one/` + `content/iai-brandpro-integration-lock.md`  
**Auth path lock:** report `/v1/auth/*` only — never `/auth` or `/me` without prefix.

This registry is operational truth for HTTP status across `*.iai.one` surfaces. QA reports and dev handoffs must align with this table and the path lock.

---

## Phán quyết tổng

| Lane | Tiếng Việt | English |
|------|------------|---------|
| CIOS | Sẵn sàng vận hành production | Production-usable |
| Hệ `*.iai.one` | Chưa sạch hoàn toàn | Not fully clean |

Nguyên nhân còn mở: vệ sinh git trên `iai.one-platform`, bốn subdomain chưa đóng, và drift diễn đạt path trong báo cáo.

Remaining gaps: git hygiene on `iai.one-platform`, four unresolved subdomains, and report path wording drift.

---

## Bề mặt live — HTTP 200

| Domain | Vai trò (codex) | HTTP | Owner | Hành động tiếp |
|--------|-----------------|------|-------|----------------|
| `iai.one` | Lớp hiến pháp | 200 | Founder | — |
| `trust.iai.one` | Lớp trust công khai | 200 | trust-pmo | Probe lại trước khi stale (30 ngày) |
| `pay.iai.one` | Lớp thanh toán và quyết toán | 200 | pay-email | — |
| `app.iai.one` | Bề mặt sản phẩm người dùng | 200 | team-app | — |
| `flow.iai.one` | Bề mặt thực thi sống | 200 | team-flow | — |
| `dash.iai.one` | Hệ điều khiển sống | 200 | team-2 | Map nguồn live; `/health` phải trả JSON |
| `docs.iai.one` | Lớp tri thức và chuẩn | 200 | team-a | — |
| `developer.iai.one` | Lớp phát triển | 200 | team-a | — |
| `api.iai.one` | Lớp backend authority | 200 | team-b | — |
| `nft.iai.one` | Lớp trust công khai | 200 | trust-pmo | — |
| `cios.iai.one` | Sản phẩm trí tuệ doanh nghiệp | 200 | team-c | Lane mạnh nhất — sẵn sàng vận hành |
| `noos.iai.one` | Lớp tổng hợp ý nghĩa | 200 | team-3 | — |
| `life.iai.one` | Nội dung đời sống (VI) | 200 | TBD | Bổ sung mission map hoặc ghi hold |

| Domain | Codex role | HTTP | Owner | Next action |
|--------|------------|------|-------|-------------|
| `iai.one` | Constitutional layer | 200 | Founder | — |
| `trust.iai.one` | Public trust layer | 200 | trust-pmo | Re-probe before stale (30d) |
| `pay.iai.one` | Payment and settlement layer | 200 | pay-email | — |
| `app.iai.one` | User product surface | 200 | team-app | — |
| `flow.iai.one` | Living execution surface | 200 | team-flow | — |
| `dash.iai.one` | Living control system | 200 | team-2 | Map live source; `/health` must return JSON |
| `docs.iai.one` | Knowledge and standards layer | 200 | team-a | — |
| `developer.iai.one` | Build layer | 200 | team-a | — |
| `api.iai.one` | Backend authority | 200 | team-b | — |
| `nft.iai.one` | Public trust layer | 200 | trust-pmo | — |
| `cios.iai.one` | Enterprise intelligence product | 200 | team-c | Strongest lane — production-usable |
| `noos.iai.one` | Future aggregate layer | 200 | team-3 | — |
| `life.iai.one` | Life content (VI) | 200 | TBD | Add to mission map or document hold |

---

## CIOS API — Workers

**URL Workers:** `https://cios-workers-api.tranhatam.workers.dev`

| Endpoint | Method | HTTP | Ghi chú |
|----------|--------|------|---------|
| `/health` | GET | 200 | Alias envelope system health |
| `/v1/meta` | GET | 200 | Capabilities |
| `/v1/auth/session` | POST | 200 | Trả JWT |
| `/v1/auth/me` | GET | 200 | Yêu cầu Bearer token |
| `/v1/auth/register` | POST | 200 | — |
| `/v1/auth/logout` | POST | 200 | Yêu cầu Bearer token |
| `/v1/system/health` | GET | 200 | — |
| `/v1/system/metrics` | GET | 200 | — |

| Endpoint | Method | HTTP | Notes |
|----------|--------|------|-------|
| `/health` | GET | 200 | System health envelope alias |
| `/v1/meta` | GET | 200 | Capabilities |
| `/v1/auth/session` | POST | 200 | Returns JWT |
| `/v1/auth/me` | GET | 200 | Bearer token required |
| `/v1/auth/register` | POST | 200 | — |
| `/v1/auth/logout` | POST | 200 | Bearer token required |
| `/v1/system/health` | GET | 200 | — |
| `/v1/system/metrics` | GET | 200 | — |

---

## AIAgent API

| Host / path | HTTP | Ghi chú |
|-------------|------|---------|
| `api.aiagent.iai.one/v1/health` | 200 | JSON — host API chuẩn |
| `api.aiagent.iai.one/v1/health/deep` | 200 | Probe KV/matrix |
| `aiagent.iai.one/v1/*` | 200 HTML | Host sai — Pages catch-all; dùng `api.aiagent.iai.one` |

| Host / path | HTTP | Notes |
|-------------|------|-------|
| `api.aiagent.iai.one/v1/health` | 200 | JSON — canonical API host |
| `api.aiagent.iai.one/v1/health/deep` | 200 | KV/matrix probe |
| `aiagent.iai.one/v1/*` | 200 HTML | Wrong host — Pages catch-all; use `api.aiagent.iai.one` |

**Lưu ý tích hợp:** CIOS gọi `POST /v1/agent/chat` (đã align với AIAgent canonical route).

**Integration note:** CIOS calls `POST /v1/agent/chat` (aligned with AIAgent canonical route).

---

## Bề mặt chưa hoàn tất hoặc bị chặn

| Domain | Vai trò | HTTP | Owner | Hành động tiếp |
|--------|---------|------|-------|----------------|
| `api.flow.iai.one` | Flow execution authority | 200 stub | team-2 | `/health` + `/v1/flow/meta` live; `/v1/meta` alias pending; full mail-api deploy |
| `mail.iai.one` | Hạ tầng mail nội bộ | 000 | pay-email | DNS → Cloudflare; HTTPS |
| `api.mail.iai.one` | Mail API | 000 | pay-email | Cùng origin với mail |
| `smtp.mail.iai.one` | SMTP submit | 000 | pay-email | Nội bộ; kiểm chứng sau khi mail live |
| `web.iai.one` | Lớp tăng trưởng web (hold) | 000 | team-5 | DNS + bằng chứng release-hold trước public |
| `cdn.iai.one` | Hạ tầng CDN nội bộ | 000 | team-b-cdn | Chỉ nội bộ — không claim public |
| `flows.iai.one` | Hạ tầng automation nội bộ | 000 | team-b-flows | Chỉ nội bộ — cần route proof |
| `cios-api.fly.dev` | CIOS Fastify API | ERR | team-c | Tùy chọn; Workers là canonical |

| Domain | Role | HTTP | Owner | Next action |
|--------|------|------|-------|-------------|
| `api.flow.iai.one` | Flow execution authority | 200 stub | team-2 | `/health` + `/v1/flow/meta` live; full mail-api TBD |
| `mail.iai.one` | Internal mail infrastructure | 000 | pay-email | DNS → Cloudflare; HTTPS |
| `api.mail.iai.one` | Mail API | 000 | pay-email | Same origin as mail |
| `smtp.mail.iai.one` | SMTP submit | 000 | pay-email | Internal; verify after mail live |
| `web.iai.one` | Website growth layer (hold) | 000 | team-5 | DNS + release-hold proof before public |
| `cdn.iai.one` | Internal CDN infrastructure | 000 | team-b-cdn | Internal-only — no public claim |
| `flows.iai.one` | Internal automation infrastructure | 000 | team-b-flows | Internal-only — route proof required |
| `cios-api.fly.dev` | CIOS Fastify API | ERR | team-c | Optional; Workers is canonical |

---

## Khóa diễn đạt path — bắt buộc

| Không được viết | Phải viết |
|-----------------|-----------|
| `/auth` hoạt động | `POST /v1/auth/session` trả JWT |
| `/me` hoạt động | `GET /v1/auth/me` hoạt động (yêu cầu Bearer) |
| auth OK | `POST /v1/auth/session` trả JWT |

| Do not write | Write instead |
|--------------|---------------|
| `/auth` works | `POST /v1/auth/session` returns JWT |
| `/me` works | `GET /v1/auth/me` works (Bearer required) |
| auth OK | `POST /v1/auth/session` returns JWT |
