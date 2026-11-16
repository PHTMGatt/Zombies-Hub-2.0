// The flat main-guide rule, shared by main-guide-shape.test.mjs, step-links-browser-smoke.mjs and the
// fixture writer below. A flat step is { id, title, goal (about two short lines), links (≤ 2) }.
//   node scripts/main-guide-shape.mjs --write   # rewrite fixtures/main-guide-flat.json from the data
// Only use --write to record that a step got flatter: the test fails on anything new.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const FLAT_FIELDS = new Set(['id', 'title', 'goal', 'links']);
export const GOAL_MAX = 140;
export const LINKS_MAX = 2;
export const FLAT_DEBT_PATH = resolve(import.meta.dirname, 'fixtures/main-guide-flat.json');
const NOTE = 'What still keeps each main guide from being a flat list (Bryen, 2026-11-16: number, title, one short line, optional details link; no expanding cards, chips, staff blocks, images or maps). One entry per step and field. Moving that content to the tab that owns it (DELTA data, ALPHA markup) removes the entry; nothing may be added. Content leaving the rendered page still follows approved-removals.json. Checked by scripts/main-guide-shape.test.mjs.';

const EMBEDDED = new Set(['image', 'custom', 'tabs']);
const embeddedTypes = (refs = [], found = new Set()) => {
  refs.forEach((ref) => {
    if (EMBEDDED.has(ref.type)) found.add(ref.type);
    (ref.tabs ?? []).forEach((tab) => embeddedTypes(tab.refs, found));
  });
  return found;
};

// What keeps a step from being flat: "<step>:<field>", "<step>:embeds:image|custom|tabs" (media, solvers,
// variant sets anywhere in its refs), "<step>:goal>140", "<step>:links>2".
export const notFlat = (step) => [
  ...[...embeddedTypes(step.refs)].map((type) => `${step.id}:embeds:${type}`),
  ...Object.keys(step).filter((field) => !FLAT_FIELDS.has(field)).map((field) => `${step.id}:${field}`),
  ...(typeof step.goal !== 'string' ? [`${step.id}:goal-not-text`] : step.goal.length > GOAL_MAX ? [`${step.id}:goal>${GOAL_MAX}`] : []),
  ...((step.links?.length ?? 0) > LINKS_MAX ? [`${step.id}:links>${LINKS_MAX}`] : []),
];

export const readFlatDebt = () => JSON.parse(readFileSync(FLAT_DEBT_PATH, 'utf8'));
// A guide with no listed leftovers must also render flat (checked in the browser).
export const isFlat = (guide, debt = readFlatDebt()) => !(debt[guide]?.length);

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href && process.argv.includes('--write')) {
  const { loadGuides } = await import('./guide-content.mjs');
  const debt = { _note: NOTE };
  for (const { guide, route, steps } of await loadGuides()) {
    if (route.startsWith('/maps/')) debt[guide] = steps.flatMap(notFlat);
  }
  writeFileSync(FLAT_DEBT_PATH, `${JSON.stringify(debt, null, 2)}\n`);
  console.log(`Wrote ${FLAT_DEBT_PATH}`);
}
