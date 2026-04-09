# PROJECT_CONTEXT_ENGINE

Status: Active operational source of truth
Last updated: 2026-04-09
Applies to: all work in `iai.one-platform`

## 1. Operating Rule

This file is the primary operational source of truth for the repo.

- Read this file first before making product, code, routing, deploy, or planning changes.
- If another planning file conflicts with this file, follow this file.
- Older planning documents under `docs/planning/` are reference material unless explicitly marked canonical reference.
- After any major architectural, routing, deploy, or product-state change, update this file.

## 2. Repo Scope

This repo is the active implementation workspace for the current `iai.one` ecosystem surfaces built here.

Active code surfaces in this repo:

- `apps/root`: `iai.one` constitutional root
- `apps/home`: `home.iai.one` portal surface
- `apps/web`: `app.iai.one` main product and community surface
- `apps/flow`: `flow.iai.one` workflow builder surface
- `workers/api`: `api.iai.one` backend authority
- `packages/database`: schema, migrations, seeds
- `packages/types`: shared types

## 3. Canonical Ecosystem Map

Use `docs/planning/IAI_ONE_ECOSYSTEM_CANONICAL_2026.md` as the canonical reference for domain authority.

Approved role map:

- `iai.one`: constitutional root / charter / trust layer
- `home.iai.one`: portal / ecosystem entry router
- `app.iai.one`: main product and community surface
- `flow.iai.one`: workflow builder product surface
- `api.iai.one`: primary backend authority for core app domains
- `api.flow.iai.one`: future flow runtime API surface

Practical routing rule:

- `iai.one` explains what IAI is.
- `home.iai.one` explains where to go.
- `app.iai.one` is where users do things.
- `flow.iai.one` is where workflow builders and runtime entry belong.

## 4. Current Product State

### `apps/root`

- English `/` and Vietnamese `/vi` are the approved public routes for the current pass.
- Root now carries the constitutional role more explicitly: trust position, system boundaries, flagship systems, and entry routing.
- Root must not drift into portal behavior or product/community behavior.

### `apps/home`

- Bilingual portal routes build successfully as of 2026-04-09.
- Portal owns ecosystem entry, path clarity, and migration-friendly routing.

### `apps/flow`

- Bilingual public flow routes build successfully as of 2026-04-09.
- Flow remains a separate product surface and must not collapse into portal or community behavior.

### `apps/web`

Current public language rule:

- `/` and default non-`/vi` public routes are English.
- `/vi/...` public routes are Vietnamese.

Current convergence rule:

- `apps/web` remains the main user destination for community, lessons, verification, profiles, and public product journeys.
- Current remaining work is convergence polish, not domain-role redefinition.

## 5. Verified Technical State

Verified locally on 2026-04-09:

- `npm --workspace apps/root run build`: PASS
- `npm --workspace apps/home run build`: PASS
- `npm --workspace apps/flow run build`: PASS
- `npm --workspace apps/web run build`: PASS
- `npm --workspace workers/api run typecheck`: PASS
- `npm run typecheck`: PASS
- `npm run verify:current-pass`: PASS

Important notes:

- Root `npm run typecheck` currently checks only `workers/api` because the root script still points to `workers/api/tsconfig.json`.
- `apps/flow` and `apps/web` may need an unrestricted local run when Next writes `.next/trace`; that was an environment/sandbox constraint, not a code regression.
- Parallel build checks can produce false negatives for `apps/home` static export (`ENOENT` around `.next/export/500.html`). Use `npm run verify:current-pass` as the canonical local verification path for the current pass.

## 6. Current Priority

Top priority order for the current pass:

1. Keep this file as the active operational truth.
2. Use `npm run verify:current-pass` for the canonical local release check.
3. Start `PR-08` flow minimum product pass.
4. Keep one-command `npm run deploy:preview` healthy after each backend/data change.
5. Keep preview URLs and smoke-check truth updated in this file after each deploy pass.
6. Keep `PR-07` wave-1 manifest and sign-off assets as the active migration baseline.

## 7. Latest Completed Pass

Completed in the latest pass:

- Fixed the `apps/home` locale blocker on the root route shell.
- Fixed the `apps/flow` locale blocker on the root route shell.
- Verified the full current build matrix for `root/home/flow/web/api`.
- Completed the first root authority pass in `apps/root` with:
  - stronger constitutional copy
  - flagship-system positioning
  - system-surface routing clarity
  - entry-point routing clarity
  - bilingual public routes for `/` and `/vi`
- Updated the root sitemap to reflect the bilingual public routes.
- Deployed a fresh `apps/web` preview build to Cloudflare Pages (`iai-web`) and confirmed the preview alias updates.
- Ran smoke checks on key EN/VI routes and auth callback entry route on the new preview deployment.
- Deployed fresh preview builds for `apps/root`, `apps/home`, `apps/flow`, and `apps/web` on 2026-04-09.
- Verified preview aliases and EN/VI route checks across `root/home/flow/web` (all checked routes returned `200 OK`).
- Completed `PR-03` portal completion on `apps/home`:
  - locale-aware surface routing map via `lib/surfaces.ts`
  - portal CTA and entry-path clarity updates
  - legacy community migration block and trust-boundary block polish
- Completed `PR-04` app convergence pass 1 on `apps/web`:
  - nav/footer/app-frame/feed convergence alignment
  - root/portal/flow route-map clarity and legacy orientation
- Completed `PR-05` app convergence pass 2 on `apps/web`:
  - lessons/verify/profile/post/marketplace/studio/policies/badges/auth route polish
  - EN/VI metadata cleanup across public route wrappers
  - responsive/a11y/SEO stability pass with fresh build verification
- Verified full build matrix again on 2026-04-09 after PR-03/04/05 updates:
  - `npm --workspace apps/root run build`: PASS
  - `npm --workspace apps/home run build`: PASS
  - `npm --workspace apps/flow run build`: PASS
  - `npm --workspace apps/web run build`: PASS
  - `npm --workspace workers/api run typecheck`: PASS
  - `npm --workspace apps/web run typecheck`: PASS
- Added `npm run verify:current-pass` at repo root so the active pass can be verified sequentially without Next export race noise across workspaces.
- Started and shipped `PR-06` API/data migration contract hardening on `workers/api`:
  - added route contract manifest endpoint: `GET /v1/migration/contracts`
  - added admin query routes: `GET /v1/migration/legacy-users`, `GET /v1/migration/audit-events`
  - fixed import-safe user upsert logic across both unique keys (`source_user_id` and `source_handle`)
  - added `dry_run` support for `legacy-users/upsert` and `legacy-content/upsert`
  - added best-effort migration audit logging (`migration_audit_events`) and schema support in `migration_v2.sql`
- Verified PR-06 endpoints on preview API:
  - `GET /v1/migration/contracts`: `200 OK`
  - `GET /v1/migration/legacy-users`: `403 Forbidden` without admin secret (expected)
  - `GET /v1/migration/audit-events`: `403 Forbidden` without admin secret (expected)
- Re-ran one-command preview deploy after PR-06:
  - `npm run deploy:preview`: PASS
  - API preview URL: `https://iai-api-preview.tranhatam.workers.dev`
  - Web preview URL: `https://ed60b80f.iai-web.pages.dev`
- Completed `PR-07` legacy migration wave-1 pack baseline in one pass:
  - added canonical manifest schema: `docs/ops/MIGRATION_WAVE1_MANIFEST_SCHEMA.json`
  - added 12-item wave-1 sample manifest: `docs/ops/MIGRATION_WAVE1_MANIFEST_SAMPLE.json`
  - upgraded dry-run scripts so `MODE=dry-run` now calls real API with `dry_run: true`
  - added one-command manifest runner: `docs/ops/scripts/migration_wave1_manifest_runner.sh`
  - added sign-off gate: `docs/ops/MIGRATION_WAVE1_SIGNOFF_CHECKLIST.md`
  - produced dry-run proof artifact: `docs/ops/MIGRATION_WAVE1_DRY_RUN_PROOF.json`
- Verified PR-07 dry-run proof on local API (`wrangler dev`, 2026-04-10):
  - users dry-run summary: total `12`, success `12`, failed `0`
  - content dry-run summary: total `12`, success `12`, failed `0`
  - audit snapshot includes dry-run events for `legacy-users-upsert` and `legacy-content-upsert`

## 8. Deploy Truth

Current known-good Cloudflare Pages deploy targets:

- `apps/root` -> Pages project `iai-root`
- `apps/home` -> Pages project `iai-home`
- `apps/flow` -> Pages project `iai-flow-frontend`
- `apps/web` -> Pages project `iai-web`
- Cloudflare account ID: `93112cc89181e75335cbd7ef7e392ba3`

Known incorrect historical account that caused confusion:

- `f3f9e76222dcb488d5e303e29e8ba192`

Latest successful previews recorded on 2026-04-09:

- `apps/root`: `https://0352c6ae.iai-root.pages.dev`
- `apps/home`: `https://470bb0a2.iai-home.pages.dev`
- `apps/flow`: `https://da5184c6.iai-flow-frontend.pages.dev`
- `apps/web`: `https://ed60b80f.iai-web.pages.dev`

Latest verified preview aliases:

- `https://preview.iai-root.pages.dev`
- `https://preview.iai-home.pages.dev`
- `https://preview.iai-flow-frontend.pages.dev`
- `https://preview.iai-web.pages.dev`

Smoke-check status on latest `apps/web` preview:

- `GET /`, `/vi`, `/verify`, `/vi/verify`, `/marketplace`, `/vi/marketplace`, `/login`, `/vi/login`: `200 OK`
- `GET /auth/callback?error=oauth_failed&locale=en`: `200 OK`
- `GET /auth/callback?error=oauth_failed&locale=vi`: `200 OK`
- Route-level title/copy signals confirmed EN/VI split remains active (including marketplace and login route variants).

Smoke-check status on latest `apps/root`, `apps/home`, and `apps/flow` previews:

- `root`: `GET /`, `/vi` -> `200 OK`
- `home`: `GET /`, `/vi` -> `200 OK`
- `flow`: `GET /`, `/vi` -> `200 OK`

Current deploy status:

- One-command preview deploy path is currently healthy:
  - `npm run deploy:preview` completes end-to-end (D1 migrate + API deploy + web preview deploy).
- Individual Pages preview deployments for `root/home/flow/web` remain healthy.

## 9. Documentation Policy

The following file classes are not active SSOT anymore:

- phased master plans
- valuation plans
- historical execution plans
- old progress snapshots

Keep them as reference unless needed for historical context.

Important files to preserve as reference:

- `docs/planning/IAI_ONE_ECOSYSTEM_CANONICAL_2026.md`
- `docs/planning/ARCHITECTURE_DECISIONS_LOG.md`
- implementation-specific specs still needed by active code owners

## 10. Working Rules For Future Changes

- Prefer minimal, direct code changes.
- Do not collapse `iai.one`, `home.iai.one`, `app.iai.one`, and `flow.iai.one` into one blurred role.
- Preserve EN default plus `/vi` public route behavior where those bilingual surfaces now exist.
- Do not reintroduce mixed EN/VI copy leakage on English public routes.
- Keep root constitutional, portal navigational, app experiential, and flow workflow-specific.
- Do not change Cloudflare project/account defaults away from the verified values unless a real infrastructure migration is confirmed.
- Update this file after any major change to routing, deploy targets, architecture authority, or product completion state.

## 11. Immediate Next Actions

- Start `PR-08` flow minimum product pass
- Maintain one-command preview deploy health (`npm run deploy:preview`) after each migration/data change
- Keep `PR-07` manifest/dry-run/sign-off assets updated when migration scope changes
