// The browser smokes `npm run test:browser` runs (scripts/run-browser-smokes.mjs), also read by golive-check and
// smoke:quick --all. Content preservation stays last and runs on its own: it reads every guide's rendered text.
// Longest first, so parallel CI lanes finish together (CI timings, 2026-11-16).
export const BROWSER_SMOKES = [
  'scripts/browser-smoke.mjs',
  'scripts/revelations-browser-smoke.mjs',
  'scripts/origins-browser-smoke.mjs',
  'scripts/achievements-browser-smoke.mjs',
  'scripts/search-browser-smoke.mjs',
  'scripts/map-tabs-browser-smoke.mjs',
  'scripts/status-pages-browser-smoke.mjs',
  'scripts/guide-sequence-browser-smoke.mjs',
  'scripts/mob-browser-smoke.mjs',
  'scripts/der-browser-smoke.mjs',
  'scripts/zets-browser-smoke.mjs',
  'scripts/gorod-footer-browser-smoke.mjs',
  'scripts/search-entries-browser-smoke.mjs',
  'scripts/step-links-browser-smoke.mjs',
  'scripts/shadows-browser-smoke.mjs',
  'scripts/gorod-browser-smoke.mjs',
  'scripts/coming-soon-browser-smoke.mjs',
  'scripts/offline-browser-smoke.mjs',
  'scripts/content-browser-smoke.mjs',
];

export const LAST_SMOKE = 'scripts/content-browser-smoke.mjs';
