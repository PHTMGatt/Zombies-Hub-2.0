# Zombies Hub 2.0

[![Build Zombies Hub 2.0](https://github.com/PHTMGatt/Zombies-Hub-2.0/actions/workflows/build.yml/badge.svg)](https://github.com/PHTMGatt/Zombies-Hub-2.0/actions/workflows/build.yml)

A unified **Call of Duty Zombies guide hub** built with React and Vite.

**Live 2.0:** https://zombies-hub-2-0.onrender.com/

**Original 1.0 Hub:** https://zombies-hub.onrender.com/

<p align="center">
  <img src="https://raw.githubusercontent.com/PHTMGatt/12-React-Portfolio/main/src/assets/photos/Zombies%20Hub.png" alt="Zombies Hub project artwork" width="900" />
</p>

Zombies Hub 2.0 brings the Hub, full Easter Egg guides, Side Easter Eggs, reference images, videos, and map-specific tools into **one application**.

The goal is simple: open a map and quickly answer **“what do I do next?”** without digging through a huge wiki page or waiting for another guide site to load.

## 1.0 vs 2.0

### Zombies Hub 1.0

The original version used a **separate React application and a separate Render service for each dedicated map guide**. Moving between maps meant moving between independent deployments with duplicated app code and more chances for cold-start/loading delays.

### Zombies Hub 2.0

2.0 is **one React application, one router, one codebase, and one Render service**. Dedicated guides load as internal routes, making map-to-map navigation faster and more seamless while each map keeps its own visual identity.

| Zombies Hub 1.0 | Zombies Hub 2.0 |
| --- | --- |
| Separate React app for each guide | **One React application** |
| Separate Render service for each guide | **One Render service** |
| Guide-to-guide website jumps | **Internal React routing** |
| Duplicated app code/dependencies | **Shared architecture** |
| More chances for cold-start delays | **Faster, smoother navigation** |

## Dedicated Guides

- Origins
- Mob of the Dead
- Shadows of Evil
- Der Eisendrache
- Zetsubou No Shima
- Gorod Krovi
- Revelations

**Origins** is the usability reference: short, visual, and easy to follow while playing. **Revelations** is the visual reference, especially for atmosphere and header/footer integration.

The guides include main Easter Egg routes, Staff/Bow/weapon guides, puzzle references, map-specific solvers, boss-fight references, Side Easter Eggs, and video/timestamp references when seeing a location is faster than reading about it.

Side EEs also includes an advanced **Origins Speed Run** companion with robot/snow routing, cycle strategy, tank and Lightning skips, staff duplication, ending setup, and a verified Lightning dial cheat sheet with untouched-switch turn counts.

## Project Structure

```text
Zombies-Hub-2.0/
├── apps/hub/              # Main Hub application
├── maps/                  # Dedicated map modules
├── shared/                # Shared UI
├── docs/                  # Architecture / deployment notes
└── scripts/               # Verification, build metadata, smoke + visual QA
```

The app uses one BrowserRouter. Map CSS is scoped by module so one guide cannot accidentally restyle another guide or the main Hub.

## Development

Requires **Node 22** (the version CI and Render use).

```bash
npm ci        # install the locked dependencies
npm run dev   # local dev server
```

## Test and Build

```bash
npm test          # unit, guide-health, content-preservation and CSS-scope tests
npm run check     # source verification
npm run build     # source verification + production compile into dist/
```

Browser smokes (Playwright, at 390×844, 844×390 and 1440×900) run against the built site:

```bash
npx playwright install chromium   # first time only
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Then, in a second terminal:

```bash
npm run test:browser
```

Render build:

```bash
npm run render
```

Live production smoke check:

```bash
npm run smoke
```

## CI / Render Pipeline

Production follows a small quality gate:

```text
push / pull request
        ↓
source verification
        ↓
unit tests
        ↓
production compile
        ↓
browser smokes
        ↓
GitHub CI passes
        ↓
Render deploys main
        ↓
scheduled / manual production smoke
        ↓
optional 100-page visual QA
```

`render.yaml` defines the static site, SPA rewrite, Node version, production asset caching, and **deploy-after-CI-passes** behavior. Every build also writes `dist/build-info.json` so the live Render deployment can be matched to its exact Git commit.

The heavy desktop/mobile screenshot pass is an **on-demand GitHub Action**. Screenshots are uploaded as short-lived Actions artifacts instead of being permanently stored in the repository.

Security checks run in three levels: `security-low` on every pull request and `claude-forge` push (secret scan, npm audit, config check, build and tests), `security-med` nightly (adds a full-history secret scan, dependency review and red-team tests) and `security-high` on demand (adds a ZAP baseline against a local instance). See [`SECURITY_REPORT.md`](SECURITY_REPORT.md).

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the production pipeline and Render settings.

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — CI, Render and live QA
- [`docs/architecture.md`](docs/architecture.md) — application architecture
- [`docs/migration-inventory.md`](docs/migration-inventory.md) — migration notes
- [`docs/polish-roadmap.md`](docs/polish-roadmap.md) — polish and QA roadmap
- [`docs/origins-interactive-roadmap.md`](docs/origins-interactive-roadmap.md) — future interactive Origins tools

---

**Zombies Hub 2.0 is one fast, unified Zombies companion instead of a collection of separate guide sites.**
