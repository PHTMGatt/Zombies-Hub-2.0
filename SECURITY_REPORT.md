# Zombies Hub 2.0: 27-point security report

- **Date:** 2026-11-09, branch `claude-forge`
- **What it is:** a static React/Vite site (one codebase, many map guides) served from Render as a static site. No backend, database, login or uploads, so most server items are N/A.
- **Scope:** code in this repo. **No UI or design files were touched.** Render dashboard settings were not inspected.

## Branch and PR status notes

- **`claude-forge` vs `main`:** 45 commits behind, 19 ahead (13 of those are not in main by content; 6 are equivalent to commits already in main). Last commit on `claude-forge`: 2026-11-02. It was **not** brought up to date: a trial merge of `origin/main` conflicts in 9 files, all guide UI or its tests (`maps/origins/src/Pages/MainGuide.tsx`, `maps/origins/src/Styles/PageStyles/MainGuide.css`, `maps/origins/src/components/Nav.tsx`, `shared/guide/GuideSteps.jsx`, `shared/achievements/achievements.js`, `package.json`, and three browser-smoke scripts/fixtures). Resolving those means making visual decisions, which need Bryen's approval. The trial merge was aborted and nothing was discarded.
- **Draft PR #52** (`chatgpt-forge` to `main`, "Revelations: restore original split-guide UI, preserve modern references"): still open and draft, last updated 2026-11-06, mergeable and CLEAN, 5 files changed (+335/-217), its `quality-gate` check is green. I did not touch it.
- **Integration risk:** the pre-existing `build.yml` runs only for pushes and PRs to `main`, so `claude-forge` has had **no CI** until now. The new security workflow runs on `claude-forge` pushes. The 13 unmerged `claude-forge` commits would conflict with main's guide UI (above), and with #52 if it merges first.

## Deploy safety

`render.yaml` sets `autoDeployTrigger: checksPass` (deploy a commit once its checks pass), so the live site deploys from the branch the Render service tracks (not visible in the repo; normally `main`). The workflows added here only run checks and have no deploy step. **If this security workflow ever lands on `main`, its result becomes part of the check set the deploy waits for**, which is intended, but a failing audit would then block deploys.

## Automated gates added

| Gate | Where |
|---|---|
| gitleaks working-tree scan (pinned, checksum-verified), allowlist, proof step with run-time fake tokens | [security-pipeline.yml](.github/workflows/security-pipeline.yml), [.gitleaks.toml](.gitleaks.toml) |
| `npm audit --audit-level=high` | security.yml |
| Config validation | [.github/scripts/check-config.mjs](.github/scripts/check-config.mjs) |
| Check, unit tests, compile, browser checks | existing [build.yml](.github/workflows/build.yml) (main only). Not duplicated. |

## Fixed here

- `npm audit fix` (lockfile only): `vite` high, fixed. The audit is now at 0 vulnerabilities. `npm run check`, 46 of 46 unit tests and `npm run compile` pass locally.

## Checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Authentication | N/A | No accounts. |
| 2 | API keys server-side | PASS (partial) | No keys found by gitleaks or the config gate. `react-youtube` embeds use public video IDs. |
| 3 | Database lockdown | N/A | No database. |
| 4 | HTTPS/TLS | UNVERIFIED | Render serves static sites over TLS; the setting was not inspected. |
| 5 | Password hashing | N/A | None. |
| 6 | Server-side validation | N/A | No server. |
| 7 | XSS prevention | PASS (partial) | React escapes output; a grep of `apps`, `maps` and `shared` found no `dangerouslySetInnerHTML`. |
| 8 | Audit logging | N/A | No server. |
| 9 | Admin authorization | N/A | None. |
| 10 | Injection | N/A | No queries. |
| 11 | Env/config security | PASS | `.env` gitignored and enforced by the config gate; `render.yaml` has no secrets (checked by the gate). |
| 12 | Rate limiting | N/A | Static hosting. |
| 13 | CORS | N/A | Static site. |
| 14 | Security headers / CSP | PASS (partial) | `render.yaml:25-28`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. **Missing:** `X-Frame-Options` / `frame-ancestors`, `Permissions-Policy`, CSP. Low risk for a static guide. Adding header lines to `render.yaml` is a deploy-config change, so it is left for Bryen. |
| 15 | Session cookies | N/A | None. |
| 16 | CSRF | N/A | None. |
| 17 | Password reset | N/A | None. |
| 18 | File uploads | N/A | None. |
| 19 | Price verification | N/A | None. |
| 20 | Debug off in production | PASS (partial) | Production Vite build; build-info is `no-store` (`render.yaml:19`). |
| 21 | Vulnerable dependencies | PASS | 0 vulnerabilities after the lockfile fix. |
| 22 | Unused packages | UNVERIFIED | Not checked. |
| 23 | Exposed files / source maps | UNVERIFIED | Not checked in `dist`. |
| 24 | Git history secret scan | UNVERIFIED | Working tree only. |
| 25 | Revoke/rotate plan | N/A | No leaked secret found. |
| 26 | Full review | PASS (partial) | Small static surface. |
| 27 | Rerun tests, report | PASS | Check, 46 tests, compile pass locally; CI result is in the checkpoint. |

## Outcome

GO as far as checked. Open: headers (14), and the branch is 45 behind main with 9 UI-file conflicts that need Bryen's visual decisions.

## Pipeline levels (one reusable workflow)

[security-pipeline.yml](.github/workflows/security-pipeline.yml) takes a `level` input; three thin callers choose it.

| Level | Caller | Runs on | Adds |
|---|---|---|---|
| LOW | `security-low.yml` | every PR and every claude-forge push | gitleaks (tree + scanner proof), `npm audit` high/critical, config checks, build and tests where the repo's own CI does not already run them |
| MED | `security-med.yml` | nightly and manual | full-history gitleaks, dependency review, red-team tests where the repo has them |
| HIGH | `security-high.yml` | manual / pre-launch | ZAP baseline (and API fuzzing where there is an API) against a local instance with fake data, never production; then a GO / NO-GO verdict. No exemptions at this level: any high or critical advisory, failed check or open FAIL in this report is NO-GO |

Until these files are on the default branch, the med and high callers also run when `claude-forge` changes them, because schedule and manual triggers need the default branch.
