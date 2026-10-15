# Zombies Hub 2.0: review pass

This branch improves the existing app without replacing its map guides or artwork. It is a review candidate, not a production release.

## Implemented
- Lazy-loaded map modules and secondary pages; route loading/error states.
- Per-route browser titles; explicit not-found pages instead of silent redirects.
- Correct Chronicles legacy URL handling, preserving game variants.
- Shadows of Evil footer overflow fix; consistent main landmarks and page headings.
- Video-only side guides now include readable context and external walkthrough fallbacks.
- Revelations timestamp selections also update a usable external video link.
- Compatible dependency fixes and a compression override; no production dependency advisories in the final local npm audit.
- Unit and browser regression tests in CI.

## Verified locally
- Source verification, unit test, and production build pass.
- 288 browser route/interaction checks pass at 375px and 1440px.
- Checks cover the map-information catalog, main guides, Chronicles aliases, invalid routes, broken images, overflow, page headings, search/empty state, and timestamp fallback selection.
- Screenshots of the original critical-route set were inspected.

## Release gates
- No production deployment or remote database changes were made.
- Live YouTube playback/seek timing is not certified: tests deliberately block third-party media and verify app behavior and fallbacks.
- The static host still returns the SPA shell for unknown paths; the app displays a not-found state, not a server HTTP 404.
- Review and merge only after confirming the production host's deployment behavior.
