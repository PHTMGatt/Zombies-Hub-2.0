# Zombies Hub 2.0 — Visual Pass Plan ("god-tier")

Status: proposal, not started. Written 2026-10-23 against `ui/quick-guide-polish` @ `6c94317`.
Scope: visual layer only. Routing, map modules, data and the GuideRun progress contract stay as they are
(see "Must not break" in section 4).

---

## 1. Visual design brief

### Core idea
**Two speeds.** The hub is a *cinematic briefing room*: you arrive, the world reacts to you, and you
pick a map the way you pick one in-game. Guides are a *field manual*: once you're in a run, the interface
gets out of the way and tells you the next action in one glance, on a phone propped next to the TV.

| Surface | Mode | Motion | Effects allowed |
|---|---|---|---|
| Landing (`/`) | Cinematic | Choreographed intro (≤1.2 s, skippable, once per session) | Layered parallax backdrop, ambient particles, reactive light, pointer tilt |
| Map selection (`/`, `/allmaps`, `/easter-eggs`, `/side-easter-eggs`) | Cinematic-lite | Staggered reveal, hover/focus light | Card lighting, depth on hover/focus, map-coloured glow |
| Map → guide transition | Cinematic | One shared-element transition (≤450 ms) | View Transition from card art to map header |
| Map shell (map header + tabs) | Atmospheric | Ambient only, never blocking | Environment backdrop, low-density particles in the header band only |
| Guide pages + GuideRun | Field manual | Feedback only (≤200 ms) | Done/next state feedback, progress fill. No particles or parallax behind text |

### Effect rules
Every effect must have one stated job: **atmosphere**, **orientation**, **hierarchy** or **feedback**.
If an effect has no job, it gets cut.

- **Atmosphere:** backdrops, particles, grain. Only on hub surfaces and in the map header band, always
  behind a scrim that keeps text at WCAG AA (4.5:1 body, 3:1 large and UI).
- **Orientation:** the shared-element map transition, the active tab indicator, the map accent colour
  carried from card to guide, a "you are here" breadcrumb line in the map header.
- **Hierarchy:** light falls on the focused or hovered card; the GuideRun "Up next" phase is the brightest
  element on the page.
- **Feedback:** Done press, progress meter fill, reset confirmation. Short, physical, never decorative.

### Accessibility baseline (applies to all stages)
- `prefers-reduced-motion: reduce` turns off intro choreography, parallax, tilt, particles and view
  transitions. You get static backdrops and instant state changes. It is checked in CSS (`@media`) and JS
  (`gsap.matchMedia()` / a `useReducedMotion` hook). `Save-Data` and `navigator.hardwareConcurrency <= 4`
  also drop particles.
- Every hover effect has a matching `:focus-visible` effect. Pointer effects run only under
  `(hover: hover) and (pointer: fine)`.
- Touch targets ≥ 44×44 px, including map tabs, GuideRun toggles and the progress panel buttons.
- Visible focus ring on every interactive element (2 px, map accent plus a dark outline, so it shows on any
  backdrop). A skip link goes to `<main>`.
- No information conveyed by colour or motion alone. Decorative canvases are `aria-hidden` and get
  `pointer-events: none`.

### Visual language (shared)
- **Base:** near-black blue-grey (`#07090d` → `#11161d`), not pure black, so glows read.
- **Type:** keep the system UI stack for body (fast, legible). Optionally add one self-hosted condensed
  display face for hub headings and map titles only (WOFF2, `font-display: swap`, ≤ 40 KB, preloaded on `/`).
- **Surfaces:** "instrument panel" cards: 1 px inner highlight, soft outer shadow, a slightly frosted
  scrim (`backdrop-filter` only where it's cheap: header and small panels, never full-page on mobile).
- **Grain:** one tiny tiled noise PNG/SVG at 3–5 % opacity across hub surfaces, for a filmic, premium feel.
- **Tokens:** `--zh-env-bg`, `--zh-env-glow`, `--zh-env-accent`, `--zh-env-accent-2`, `--zh-env-scrim`,
  `--zh-env-grain`, `--zh-env-particle`. Each map sets these once on its `.map-module` root. GuideRun keeps
  its existing `--run-*` tokens; each map's `theme` object stays the source for the guide colours.

### Map environments

Each map defines: a palette, a backdrop (static, lazy, responsive), an ambient effect (optional, header
band only), a texture motif, and a feedback accent (used for Done/next highlights).

| Map | Environment | Palette (bg / glow / accent) | Backdrop | Ambient effect | Motif |
|---|---|---|---|---|---|
| **Mob of the Dead** | Dark prison, industrial, hellfire | soot `#0b0807` / ember `#ff5a1f` / brass `#ffc940` (keep) | Alcatraz cell block, sodium-lamp falloff, red under-glow from below | Rising embers + faint heat shimmer (CSS) | Riveted steel plates, stencilled cell numbers, chain-link scrim |
| **Origins** | Battlefield, dieselpunk, ancient energy | mud `#0e0c09` / ancient amber `#e8b04a` / elemental blue `#7cc8ff` (keep) | Trench horizon, Giant-robot silhouette, excavation-site glow | Drifting dust and smoke; 4 elemental motes (fire/ice/wind/lightning) on staff pages | Brass gauges, riveted dieselpunk plates, carved glyph lines |
| **Revelations** | Cosmic, fractured reality, blue energy | void `#05060f` / rift blue `#4fb6ff` / starlight `#8fd2ff` (keep) | Shattered floating islands against a nebula | Slow starfield drift, occasional fracture shimmer along the header edge | Shard-cut panel corners, faint hex/void lines |
| **Shadows of Evil** *(proposal)* | 1940s noir, Art Deco Morg City, eldritch Apothicon | ink `#08070c` / neon magenta `#d65cff` / eldritch violet `#c79cf2` (keep) | Rain-slick street, Art Deco skyline, Shadowman neon sign | Diagonal rain streaks (low density), gaslight flicker on header neon | Gold Deco fan lines, film-noir grain stronger here (6 %), Keeper "beast" tentacle silhouette |
| **Der Eisendrache** *(proposal)* | Alpine castle, storm, dragon fire, Keeper lightning | slate `#080b10` / storm cyan `#8fd6ff` (keep) / dragon ember `#ff7a3c` (secondary) | Castle on a snowy cliff under storm clouds, dragon silhouette | Snowfall plus rare lightning flash (opacity pulse, ≥10 s apart, off under reduced motion; no strobing) | Iron-and-stone heraldry, bow-element colour chips (fire/void/wolf/storm) |
| **Zetsubou No Shima** *(proposal)* | Overgrown jungle lab, toxic spores, rain and water | deep jungle `#05100c` / bioluminescent green `#7cebb8` (keep) / spore yellow `#d7e85a` | Wrecked Division 9 lab half-sunk in jungle | Floating spores/fireflies drifting upward, faint water caustics on the header band (CSS) | Rusted Japanese lab signage, plant tendrils framing panel corners |
| **Gorod Krovi** *(proposal)* | Burning Stalingrad, dragons, Soviet war machine | ash `#0f0705` / burning orange `#ff5a32` / ember `#ff8a63` (keep) | Ruined city skyline, dragon over the Dragon Network spire, red sky | Falling ash (grey) mixed with a few embers | Soviet propaganda red bands, stencil type, Groph tank plating |

Guide accents (`--run-*`) keep today's values. Changes happen only if contrast checking against the new
backdrops requires it. The environment palette mostly drives the hub card glow, the map header backdrop
and the transition colour.

---

## 2. Staged implementation plan

Each stage is a small PR-sized change: build it, verify it against the QA checklist (section 4), commit,
then move on. Stage 0 has no visible change. Stages 1–4 are hub, 5–11 are maps (one map each), 12 is guide
polish, 13 is hardening.

### Stage 0 — Foundations (no visible change)
- **0a. Lazy map modules.** Turn the seven `maps/*/routes/*Routes` imports into `React.lazy` plus
  `<Suspense>` with a lightweight branded fallback (no layout shift: reserves map header height).
  This cuts the 440 KB initial JS and splits each map's CSS into its own chunk.
  Files: `apps/hub/src/app/AppRoutes.jsx`, new `shared/ui/RouteFallback.jsx`.
  **Risk:** splitting CSS changes cascade order. QA every map route for style regressions; this is the
  main reason this step is isolated.
- **0b. Tokens and motion utilities.** New `shared/styles/tokens.css` (base colours, `--zh-env-*`
  defaults, radii, shadows, focus ring, motion durations/easings, z-index scale), imported from
  `apps/hub/src/styles/global.css`. New `shared/motion/useReducedMotion.js`,
  `shared/motion/gsap.js` (single GSAP registration + `gsap.matchMedia()` presets),
  `shared/motion/usePointerLight.js` (one rAF-throttled `pointermove` that writes `--px/--py` CSS vars,
  fine pointers only).
- **0c. Image diet.** One-off script `scripts/optimize-images.mjs` (needs `sharp`, see section 3) to
  produce WebP/AVIF at 640/1280/1920 widths for the heaviest assets (`Rev3.png`, `GK_Banner.png`,
  `mob-banner.png`, `mob-bg.png`, `GK_Map.png`, Origins staff code PNGs). Originals stay in place. Imports
  are switched per map in its own stage, so each swap is verified with that map.

### Stage 1 — Hub shell and navigation
Premium header: dark frosted bar, brand mark, animated active-tab indicator (CSS transition of a
pseudo-element; no JS), clear `:focus-visible`, a skip link, and 44 px targets on mobile. The two-row
mobile layout keeps `--hub-nav-height` accurate.
Files: `apps/hub/src/components/HubHeader.jsx`, `apps/hub/src/styles/hub-header.css`,
`apps/hub/src/styles/global.css`, `apps/hub/src/components/HubFooter.jsx`, `apps/hub/src/styles/hub-footer.css`.

### Stage 2 — Landing hero
Full-bleed "briefing room": layered backdrop (static image + gradient + grain), one ambient particle
canvas, pointer-reactive light (CSS radial gradient driven by `--px/--py`), and a GSAP intro timeline
(title → subtitle → map selector). The intro runs once per session (`sessionStorage`) and is skipped
under reduced motion. Content is server-visible text (no text inside canvas).
Files: `apps/hub/src/pages/Home.jsx`, `apps/hub/src/styles/pageStyles/Home.css`,
new `shared/fx/AmbientCanvas.jsx` + `shared/fx/presets.js` (2D canvas: embers/dust/stars/rain/snow/spores/ash),
new `shared/fx/Grain.css`, new `apps/hub/src/components/landing/HeroBackdrop.jsx`.

### Stage 3 — Map selection
The Home grid becomes the map selector. All seven dedicated maps appear (Shadows of Evil and Zetsubou are
currently missing from `featuredMaps`), plus All Maps and Side EEs. Cards get reactive lighting, depth on
hover/focus (≤ 4° tilt, fine pointer only), and a map-coloured edge glow from a single map-environment
registry. `MapCard` gains focus parity for its hover image swap. On `/allmaps` and `/easter-eggs` the
effect is lighter: lighting and glow only, no tilt.
Files: new `shared/data/mapEnvironments.js` (per-slug palette, backdrop imports, particle preset; the
single source used by the hub and the map modules), `apps/hub/src/data/featuredMaps.js`,
`apps/hub/src/pages/Home.jsx`, new `apps/hub/src/components/MapSelectCard.jsx`,
`apps/hub/src/components/MapCard.jsx`, `apps/hub/src/styles/compStyles/MapCard.css`,
`apps/hub/src/styles/pageStyles/AllMaps.css`, `apps/hub/src/pages/AllMaps.jsx`, `apps/hub/src/pages/EasterEggs.jsx`.

### Stage 4 — Cinematic map transitions
Use React Router 7's built-in `viewTransition` on map-entry links (no library). The card art morphs into
the map header backdrop via `view-transition-name: map-<slug>`, with a short fade of the hub chrome.
Browsers without View Transitions get a normal navigation. Reduced motion sets
`::view-transition-group(*) { animation: none }`.
Files: `apps/hub/src/components/MapSelectCard.jsx`, `apps/hub/src/components/MapCard.jsx`,
`shared/ui/MapChrome.css`, `apps/hub/src/styles/global.css`.
**Check:** the scroll-to-top in `App.jsx` (`useRouteViewport`) still fires correctly with transitions.

### Stages 5–11 — Map environments (one map per stage)
Order: **5 Mob of the Dead → 6 Origins → 7 Revelations** (briefs given) → **8 Shadows of Evil →
9 Der Eisendrache → 10 Zetsubou No Shima → 11 Gorod Krovi**.

Per map:
- Set the `--zh-env-*` tokens and `data-env="<slug>"` on the map root `<section className="map-module …">`.
- Add the environment backdrop to the **map header band only**: responsive optimised image + gradient +
  motif + optional `AmbientCanvas` preset (≤ 40 particles, header band only, paused when scrolled away).
- The page body behind guide text gets a static, low-contrast backdrop plus a scrim. No motion there.
- Tune that map's GuideRun `theme` only if contrast QA fails.
- Swap that map's heavy image imports to the Stage 0c optimised versions.

Files per map (example: Mob):
`maps/mob-of-the-dead/routes/MobRoutes.jsx`, `maps/mob-of-the-dead/src/components/Header.jsx`,
new `maps/mob-of-the-dead/src/styles/environment.css` (scoped under `.mob-module` / `[data-env]`),
`maps/mob-of-the-dead/src/styles/Header.css`, optionally `maps/mob-of-the-dead/src/pages/MobMain.jsx`
(theme values only). The same pattern applies to:

| Map | Routes file | Header | Main guide (theme only) |
|---|---|---|---|
| Origins | `maps/origins/routes/OriginsRoutes.jsx` | `maps/origins/src/components/Header.tsx` | `maps/origins/src/Pages/MainGuide.tsx` (capital P) |
| Revelations | `maps/revelations/routes/RevelationsRoutes.jsx` | `maps/revelations/src/components/Header.jsx` + `Header.css` | `maps/revelations/src/pages/MainGuide.jsx` |
| Shadows of Evil | `maps/shadows-of-evil/routes/ShadowsRoutes.jsx` | `maps/shadows-of-evil/src/components/Header.jsx` | `maps/shadows-of-evil/src/pages/MainGuide.jsx` |
| Der Eisendrache | `maps/der-eisendrache/routes/DerEisendracheRoutes.jsx` | `maps/der-eisendrache/src/components/Header.tsx` | `maps/der-eisendrache/src/pages/Home.tsx` |
| Zetsubou No Shima | `maps/zetsubou-no-shima/routes/ZetsubouRoutes.jsx` | `maps/zetsubou-no-shima/src/components/Header.jsx` | `maps/zetsubou-no-shima/src/pages/MainGuide.jsx` |
| Gorod Krovi | `maps/gorod-krovi/routes/GorodRoutes.jsx` | `maps/gorod-krovi/src/components/Header.jsx` | `maps/gorod-krovi/src/pages/MainGuide.jsx` |

Shared to all: `shared/ui/MapChrome.css` (environment backdrop slot under `.zh-map-header`, one time in Stage 5).
Header/Footer components must not contain "Zombies Hub 2.0" text (enforced by `verify.mjs`).

### Stage 12 — Light guide polish (GuideRun + guide pages)
CSS only; `GuideRun.jsx` logic is unchanged. If any markup change is needed, it's limited to class names
and attributes, and is reviewed against the progress contract.
- "Up next" phase gets the strongest contrast and the accent edge; done phases collapse to one quiet line
  (already the behaviour, now with clearer styling).
- Done press feedback: a ≤ 200 ms check scale/fade plus a meter fill transition. Instant under reduced
  motion.
- Progress panel: `env(safe-area-inset-bottom)` padding, 48 px buttons, never covers the last phase
  (bottom spacer).
- Readable type scale on phones: 16 px body minimum, `max-width: 62ch`, line-height 1.5.
- Consistent `:focus-visible` and 44 px targets on map tabs and guide links.
Files: `shared/ui/GuideRun.css`, `shared/ui/GuideLayout.css`, `shared/ui/MapChrome.css`; per-map guide
CSS only where it fights the shared styles (e.g. `maps/*/src/styles/MainGuide*.css`).

### Stage 13 — Hardening
Run the full performance budget and QA checklist across all routes. Remove dead hub code only if you
confirm it (`Navbar.jsx`, `ThemeToggle.jsx`, `MapsHubHeader.jsx` currently appear unused), each in a
separate commit. Update `docs/architecture.md` with the environment-token convention.

---

## 3. Libraries

| Need | Choice | Why |
|---|---|---|
| Choreography (landing intro, staggered card reveal, timeline control, `matchMedia` for reduced motion) | **GSAP** + `@gsap/react` (`useGSAP` gives cleanup under StrictMode) | Best-in-class timelines; all plugins are free. Loaded only by hub pages; guide chunks never import it after Stage 0a. |
| Route transitions | **None.** React Router 7 `viewTransition` + View Transitions API | Native; progressive enhancement. |
| Particles | **None.** A small custom 2D canvas (`shared/fx/AmbientCanvas.jsx`) | ~2–3 KB; full control over pausing, density and DPR. tsParticles would add 30–80 KB for the same result. |
| Reactive light / tilt / parallax | **None.** CSS custom properties + one rAF pointer hook | Cheap, compositor-friendly. |
| 3D | **None** (no Three.js) | Nothing here needs real geometry; layered 2D parallax and lighting gives the depth. Revisit only for a single hero object (e.g. a rotating Origins staff), and then lazy-load it on desktop only. |
| Image optimisation (dev, one-off) | `sharp` (dev dependency) | Converts the 2–3 MB PNGs to responsive WebP/AVIF. |

**Install (you run these; I can't install packages):**
```bash
npm install gsap @gsap/react
npm install -D sharp
```
Optional, only if you approve a display font in Stage 1: one `@fontsource/*` package for a condensed
display face (chosen in Stage 1).

---

## 4. Performance budget and QA checklist

### Budget
| Metric | Budget | Today |
|---|---|---|
| Initial JS on `/` (gzip) | ≤ 150 KB including GSAP (~28 KB) | 137 KB (all maps eager) |
| Map route chunk (gzip, JS) | ≤ 60 KB per map | n/a (not split) |
| CSS on first load (raw) | ≤ 70 KB (hub + shared) | ~149 KB (all maps) |
| Landing hero image | ≤ 200 KB at 1920 w, ≤ 90 KB at 640 w (AVIF/WebP) | — |
| Any single image shipped to mobile | ≤ 250 KB | up to 3 MB |
| LCP (Moto G-class, 4G throttled) | ≤ 2.5 s on `/` and on each map main guide | measure in Stage 0 |
| CLS | ≤ 0.05 (Suspense fallback reserves header height) | measure |
| INP | ≤ 150 ms; GuideRun Done ≤ 100 ms | measure |
| Ambient canvas | ≤ 2 ms per frame on mid-range mobile; 30 fps cap on mobile; DPR capped at 1.5; paused on `visibilitychange` and when off-screen | — |
| Main thread during landing intro | no long task > 50 ms | — |
| Guide pages | zero canvases, zero GSAP, zero `backdrop-filter` over long scroll areas | — |

Also lazy-load and set `decoding="async"` on below-the-fold images; preload only the landing hero image
and (if used) the display font. YouTube embeds stay click-to-load (facade), never autoload.

### QA checklist (run per stage)
**Widths:** 360 × 740 (small phone), 390 × 844 (phone), 768 × 1024 (tablet portrait), 1024 × 768 (tablet
landscape), 1440 × 900 (laptop), 1920 × 1080 (desktop).

- [ ] `npm run build` passes (includes `verify.mjs`); no new warnings
- [ ] No errors or warnings in the console on: `/`, `/allmaps`, `/easter-eggs`, `/side-easter-eggs`,
      `/info/<slug>`, `/maps/<non-dedicated slug>`, each map index, and at least one sub-route per map
      (e.g. `/maps/origins/fire-staff`, `/maps/der-eisendrache/bows/void`, `/maps/zetsubou-no-shima/cogs/2`)
- [ ] Old aliases still work: `/maps/origins/FireStaff`; an unknown route redirects to `/`; a hard refresh
      on a deep link works under `npm run preview`
- [ ] **GuideRun:** mark phases done on each of the 7 maps, reload, and confirm progress persists; Undo,
      Reset (with confirm) and progress-panel Done/Next-scroll work; localStorage keys are still
      `zh-run-progress:<runId>`; it works with storage blocked (private window)
- [ ] **Keyboard:** Tab order is logical from the skip link through header, map tabs and content; every
      control has a visible focus ring; card effects trigger on focus; no focus traps; Enter/Space operate
      toggles
- [ ] **Reduced motion** (OS setting or DevTools emulation): no intro, parallax, tilt, particles or view
      transitions; content fully usable; no motion-only feedback
- [ ] **Contrast:** body text ≥ 4.5:1 and UI/large text ≥ 3:1 over every backdrop (spot-check with
      DevTools picker at the brightest backdrop point)
- [ ] **Touch:** all targets ≥ 44 px; no hover-only information; the progress panel doesn't cover content
      and respects safe areas (iOS)
- [ ] **Performance:** Lighthouse mobile on `/` and two map guides meets the budget; Performance panel shows
      canvas paused when the tab is hidden or the header is scrolled off
- [ ] No horizontal scroll at 360 px; map tab strip scrolls and centres the active tab
- [ ] Hub header is unchanged by any map's CSS (open every map, then go back to `/`)

### Must not break (carry-over contract)
1. `zh-run-progress:<runId>` key format, the seven runIds, and phase order (progress is index-based).
2. All route paths and aliases; `render.yaml` SPA rewrite.
3. `dedicatedGuideSlugs` stays in sync with `AppRoutes`.
4. Map CSS stays scoped under its `.map-module` root (more important once CSS is split into chunks).
5. `--hub-nav-height`, `--zh-map-*-h`, `.zh-map-tabs a[aria-current="page"]`.
6. GuideRun ARIA (`aria-pressed`, progressbar values, `aria-live`), `.zh-visually-hidden`.
7. `--run-*` token names.
8. `verify.mjs` rules and exact file-name casing (`maps/origins/src/Pages`).
9. Pages keep working when storage is blocked.
