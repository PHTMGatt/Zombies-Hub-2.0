# Zombies Hub 2.0 Deployment

Production: https://zombies-hub-2-0.onrender.com/

## Pipeline

Zombies Hub 2.0 uses GitHub Actions as the blocking quality gate and Render as the production static-site host.

```text
push / pull request
        ↓
GitHub: locked dependency install
        ↓
GitHub: source verification
        ↓
GitHub: production compile
        ↓
CI success
        ↓
Render: deploy main
        ↓
Production smoke checks
        ↓
On-demand desktop/mobile visual QA
```

## GitHub Actions

### Build Zombies Hub 2.0

Runs on pushes to `main` and pull requests targeting `main`.

It uses Node 22, `npm ci`, the custom source verifier, and a production Vite compile. The generated `dist/` bundle is kept as a short-lived Actions artifact for debugging.

### Production Smoke

Runs daily and can also be started manually. It checks the live Render site plus the critical Hub and dedicated-guide routes.

### Visual QA Screenshots

Manual only. It first runs the live smoke test and can optionally wait for an expected commit SHA. It then captures the full route set at desktop and mobile widths and uploads the screenshots as a three-day Actions artifact.

Keeping this job manual prevents the heavy screenshot pass from becoming a deployment blocker or racing Render while production is still updating.

## Render

The repository root contains `render.yaml`.

Production settings are:

- Runtime: Static Site
- Build command: `npm run render`
- Publish directory: `dist`
- Node: 22
- Auto deploy: after CI checks pass
- SPA rewrite: `/*` → `/index.html`
- Hashed Vite assets: one-year immutable cache

`npm run render` performs a clean lockfile install and then runs the same verification/build path used by CI.

Render automatically exposes `RENDER_GIT_COMMIT`. The build writes that value to `dist/build-info.json`, allowing smoke/visual-QA jobs to confirm exactly which Git commit is live.

## Existing manually-created Render service

If the current `zombies-hub-2-0` service was created directly in the Render Dashboard instead of from the Blueprint, mirror these settings in the service dashboard:

1. Build Command: `npm run render`
2. Publish Directory: `dist`
3. Auto-Deploy: **After CI Checks Pass**
4. Redirect/Rewrite: source `/*`, destination `/index.html`, action `Rewrite`
5. Node version: `22`

The `render.yaml` file becomes the infrastructure source of truth only when the service is managed by a Render Blueprint.

## Local checks

```bash
npm run check
npm run build
npm run smoke
```

To smoke-test another deployment:

```bash
ZH_SMOKE_BASE_URL=https://example.onrender.com npm run smoke
```

To require a particular production commit:

```bash
ZH_EXPECTED_SHA=<full-git-sha> npm run smoke
```

## Rollback

Because the app is a static site with no database migrations, rollback is straightforward: revert the bad commit on `main` (or redeploy a known-good commit in Render), allow CI to pass, then verify production with the smoke workflow.
