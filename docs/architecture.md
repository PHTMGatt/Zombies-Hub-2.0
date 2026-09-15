# Zombies Hub 2.0 Architecture

## Current architecture

Zombies Hub 2.0 is one integrated React application:

- one React root
- one `BrowserRouter`
- one Hub shell
- one persistent Hub header/navigation
- map-specific sub-layouts and headers
- one production Render deployment

Dedicated map guides remain isolated in their own folders so each map behaves like a feature module without becoming a separate application.

## Why 2.0 is different

Zombies Hub 1.0 treated the dedicated guides as separate React applications and separate Render services. The Hub linked or embedded those applications, so navigation crossed application boundaries and each guide carried its own runtime, router, root CSS, and deployment lifecycle.

Zombies Hub 2.0 mounts the dedicated guides directly inside the Hub under namespaced routes:

```text
/maps/origins/*
/maps/mob-of-the-dead/*
/maps/shadows-of-evil/*
/maps/der-eisendrache/*
/maps/zetsubou-no-shima/*
/maps/gorod-krovi/*
/maps/revelations/*
```

There are no dedicated-map iframe or standalone Render dependencies in the 2.0 runtime.

## Layout ownership

### Hub shell

The Hub owns:

- global site header/navigation
- top-level routing
- global footer behavior
- site-wide page spacing
- shared tokens and utilities

### Map module

Each dedicated map owns:

- its map-specific header/sub-navigation
- pages and focused guide routes
- map-specific components and data
- media/assets
- visual identity

Map styles must stay scoped beneath the map root class. A map should not redefine Hub shell classes or generic `body`, `html`, `#root`, `main`, `a`, or `button` selectors without map scoping.

Example:

```css
.origins-module .origins-header { ... }
.origins-module .origins-nav { ... }
```

rather than:

```css
body { ... }
.header { ... }
.nav-links { ... }
```

## Repository structure

```text
Zombies-Hub-2.0/
├── apps/
│   └── hub/
│       └── src/
│           ├── app/
│           ├── components/
│           ├── data/
│           ├── pages/
│           └── styles/
├── maps/
│   ├── origins/
│   ├── mob-of-the-dead/
│   ├── shadows-of-evil/
│   ├── der-eisendrache/
│   ├── zetsubou-no-shima/
│   ├── gorod-krovi/
│   └── revelations/
├── shared/
│   ├── data/
│   └── ui/
├── scripts/
└── docs/
```

## Router pattern

`apps/hub/src/app/AppRoutes.jsx` owns top-level routing and mounts each map router below the Hub layout.

Conceptually:

```jsx
<Route element={<HubLayout />}>
  <Route index element={<Home />} />
  <Route path="allmaps" element={<AllMaps />} />
  <Route path="maps/origins/*" element={<OriginsRoutes />} />
  <Route path="maps/mob-of-the-dead/*" element={<MobRoutes />} />
</Route>
```

A map router then owns relative routes such as `fire-staff`, producing URLs like:

```text
/maps/origins/fire-staff
```

Dedicated map routers should include a safe fallback so stale or mistyped sub-routes return to the map guide instead of rendering blank map chrome.

## Guide design rule

Zombies Hub is a guide, not a wiki. Page hierarchy should answer:

> What does the player need to do next?

Main quest pages should stay scan-friendly. Detailed mechanics, locations, puzzle images, timestamps, videos, and solvers belong on focused reference pages that are linked at the point the player needs them.

Origins is the usability/structure benchmark. Revelations is the visual benchmark. Maps should keep their own identity rather than receiving one identical theme.

## Production verification

The repository uses one shared critical-route manifest at `scripts/critical-routes.mjs` for production smoke checks and visual QA. This keeps HTTP route coverage and Playwright desktop/mobile coverage aligned.

Visual QA checks critical routes for:

- navigation failures
- page runtime errors
- broken images
- horizontal overflow on desktop and mobile

The source verifier also protects against legacy standalone Render URLs, obsolete route fields, unsafe migrated asset paths, and map CSS/branding regressions.

## Source repositories

The original repositories remain read-only migration/reference sources. All 2.0 changes belong in `PHTMGatt/Zombies-Hub-2.0` only.
