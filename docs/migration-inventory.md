# Migration Inventory

## Source repositories

Read-only sources currently identified:

- `PHTMGatt/Zombies-Hub`
- `PHTMGatt/Origins-Guide`
- `PHTMGatt/Origins-EE`
- `PHTMGatt/MOTD-Guide`
- `PHTMGatt/Der-Eisendrache-Guide`
- `PHTMGatt/Zetsubou-Guide`
- `PHTMGatt/Gorod-Krovi-Guide`
- `PHTMGatt/Revelations-Guide`

Target repository:

- `PHTMGatt/Zombies-Hub-2.0`

## Main Hub

Stack observed:

- React 19
- React Router DOM 7.5.x
- Vite 6.x
- react-icons
- Render-oriented `serve -s dist` production script

Important current routes:

- `/`
- `/allmaps`
- `/easter-eggs`
- `/easter-eggs/:slug`
- `/maps/:slug`
- `/info/:slug`
- `/side-easter-eggs`
- `/side-easter-eggs/:mapKey`

Current Hub layout behavior:

- `Navbar` is rendered globally from `App.jsx`.
- `/maps/*` toggles an `html.map-page` class and hides the Hub footer.
- Dedicated map pages with `renderLink` render `MapsHubHeader` plus an iframe.
- `MapDetails.css` positions the iframe from `top: var(--nav-height)`.

## Dedicated Render-backed guides referenced by Hub

Current `mapData.js` explicitly links these map routes to external Render services:

- Mob of the Dead
- Origins
- Der Eisendrache
- Zetsubou No Shima
- Gorod Krovi
- Revelations

These are the first dedicated modules that must replace iframe behavior in 2.0.

## Origins

`Origins-Guide` is the current React/Vite application to use as the primary migration source.

Observed pages:

- Main Guide
- Fire Staff
- Ice Staff
- Wind Staff
- Lightning Staff

Observed map shell:

- Origins-specific header
- Origins-specific nav
- Origins-specific footer
- map audio/media assets
- separate page styles for each staff

Compatibility issues for integration:

- uses absolute routes (`/`, `/FireStaff`, etc.) that must become nested/relative routes
- uses global `html`, `body`, `main`, and universal selectors
- uses generic class names like `.nav-links`
- applies its own page background directly to `body`

`Origins-EE` appears to be an older/non-React asset and guide source containing legacy staff HTML/CSS/media and images. It should be treated as supplemental source material, not blindly merged over the newer `Origins-Guide` app.

## Mob of the Dead

Observed pages:

- main guide
- free Blundergat
- spoon
- Redeemer
- logs
- final step
- not found

Observed shell:

- map header with banner
- internal map nav
- footer
- fixed full-page background/tint layers

Integration concerns:

- React 18 + Router 6.x source
- owns its own `BrowserRouter`
- global styles target `html`, `body`, `#root`, `a`, headings, and generic `.app-container`

## Der Eisendrache

Observed pages/features:

- home/main guide
- parts
- wisps
- bow section
- base bow
- electric/storm bow
- fire bow
- wolf bow
- void bow

Observed shell:

- Der Eisendrache-specific header
- navbar
- footer
- header spacer for fixed header

Integration concerns:

- React 18 source with Router 7.x dependency
- TypeScript/TSX mixed into application
- owns its own `BrowserRouter`
- global styles modify `html`, `body`, `#root`, headings, links, and background pseudo-element

## Zetsubou No Shima

Observed pages/features:

- main guide
- prerequisites
- reveal blueprint
- cogs
- individual cog steps
- buildables
- elevator battle
- extras

Observed shell:

- Zetsubou header
- collapsible map nav
- footer usage within map pages/components

Integration concerns:

- React 18 + Router 6.x source
- owns its own `BrowserRouter`
- global styles target `html`, `body`, `#root`, `a`, `ul`
- body background and body pseudo-element must become map-root scoped

## Gorod Krovi

Observed pages/features:

- main guide
- buildables
- trophy challenges
- valve solver
- boss fight

Observed shell:

- banner header
- map-specific internal nav
- footer

Integration concerns:

- React 18 + Router 6.x source
- owns its own `BrowserRouter`
- global stylesheet sets `html/body/#root` to flex and applies background
- generic `main`, `a`, and `button` selectors would affect the Hub if imported unchanged

## Revelations

Observed pages/features:

- main guide
- Apothicon upgrade
- egg locations
- summoning key
- sound step
- large map-specific image library

Observed shell:

- Revelations header/nav
- footer

Integration concerns:

- React 18 + Router 6.x source
- Vite 4.x source
- owns its own `BrowserRouter`
- global stylesheet targets `body`, all headings, `a`, `ul`
- generic `.header`, `.header-left`, `.header-nav`, `.nav-link` naming can collide with other map modules

## Header/layout root cause

The current broken/inconsistent header behavior comes from layering separate applications rather than one shared application shell:

1. The Hub always mounts its fixed `Navbar`.
2. Dedicated map pages additionally mount `MapsHubHeader`.
3. The external guide application inside the iframe mounts its own header/nav.
4. The iframe positioning only accounts for the Hub navbar height.
5. Each external guide is a different React document with its own router, CSS root, body, and responsive behavior.

This creates the visual double/triple-header effect and makes unified navigation impossible.

## 2.0 correction

- Keep one global Hub header.
- Remove `renderLink` iframe behavior as each dedicated map is migrated.
- Mount the map's existing header directly beneath the Hub header as a map sub-header.
- Convert absolute map routes to nested routes.
- Scope each map's global CSS beneath a unique map root class.
- Normalize the dependency/runtime layer at the repository root while preserving map components.

## Migration order

1. Scaffold shared app/runtime.
2. Move/copy current Hub into `apps/hub` and get original Hub behavior running locally in the new structure.
3. Integrate Origins first.
4. Verify `/maps/origins/*` navigation, Hub header persistence, Origins sub-header, styling, media, and responsive behavior.
5. Repeat the same pattern for Mob, Der Eisendrache, Zetsubou, Gorod, and Revelations.
6. Validate all non-dedicated maps/video-guide routes from the original Hub.
7. Remove obsolete iframe and Render-link code from 2.0 only.
8. Build/deploy the unified app after parity checks.
