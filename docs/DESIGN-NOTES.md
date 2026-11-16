# Design notes (look rules, 2026-11-16)

The rules Bryen set for the guides, and where they live, so edits stay consistent.

## Rules
- **Main guide = flat list**: number, title, one short line, optional small "details" links. No expand/collapse, chips, images, header bars. Detail lives on the nav tabs and the **Step details** tab.
- **Calm**: body text 16px+ (labels and chips 14px+), one readable column (about 50rem), one panel, no box-in-box, no micro-caps labels, high contrast, 44px tap targets.
- **One tab bar** for all seven maps: pill, single scrolling row on phones, each map's accent colour. Active tab = `aria-current="page"`.
- **No decoration that teaches nothing** (no mini-map sketches on staff pages). Pickers that select a clip stay.
- Nothing reaches `main` until Bryen approves screenshots at 1440×900, 390×844, 844×390.

## Where things are
| What | File |
| --- | --- |
| Flat main-guide list | `shared/guide/FlatGuide.jsx`, `flat-guide.css` (palette via `--flat-*`) |
| Step details tab | `shared/guide/StepDetails.jsx`, `step-details.css` |
| Tab bar (all maps) | `shared/ui/map-tabs.css` (`--map-tab-accent` per map module) |
| Shared tab-page layout | `shared/ui/GuideLayout.css` ("calm pass" block at the end) |
| Tokens | `shared/ui/tokens.css`: `--zh-fs-body`, `--zh-fs-label`, `--zh-target` (44px), `--zh-radius-panel/-pill`, `--zh-panel-width`, `--zh-focus-ring`. (`--zh-tap` is the older 48px token: don't reuse it for 44px.) |
| Share images | `public/og-image.png` (hub), `public/og/<map>.jpg` (per map, existing art only) |
| Print view | end of `apps/hub/src/styles/global.css` |
| Origins switches on the map | `maps/origins/src/components/LightningSwitchBoard.jsx`, `OriginsMap.jsx` (spots in `originsPlaces.js` are estimates) |

## Checks
- `scripts/visual-baseline.mjs --update` after an approved look change, then plain `node scripts/visual-baseline.mjs` to catch silent drift (needs `npm run preview`; baseline is local, in `artifacts/`).
- `scripts/a11y-browser-smoke.mjs`: names, alt text, h1, ids, 44px taps on every key route at 390×844.
- Changing a token's value is a visual change: compare screenshots before and after.
