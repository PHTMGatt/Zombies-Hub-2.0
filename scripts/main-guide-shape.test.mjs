// Main guide shape (Bryen, 2026-11-16): the main guide is a FLAT, simple list of the Easter Egg steps:
// number, title, one short explanation, an optional small "details" link to the tab that owns the depth.
// No expanding cards, chips, staff blocks, images or maps. These checks hold that line:
// - a flat step is { id, title, goal (≤ GOAL_MAX characters, about two short lines), links (≤ 2) };
//   anything else a step still carries is listed in fixtures/main-guide-flat.json and may only shrink;
// - every step link goes to a real tab route of that map, with a well-formed section id;
// - stepLinkHref / stepOrigin build and read the step ↔ tab round trip safely.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadGuides, loadModules } from './guide-content.mjs';
import { notFlat, readFlatDebt } from './main-guide-shape.mjs';

const root = resolve(import.meta.dirname, '..');
const SECTION_ID = /^[a-z0-9][a-z0-9-]*$/i;
const allowed = readFlatDebt();
const guides = (await loadGuides()).filter(({ route }) => route.startsWith('/maps/'));
const [{ stepLinkHref, stepOrigin, FROM_PARAM }] = await loadModules(['shared/guide/stepLinks.js']);

const stepLinks = (step) => [
  ...(step.links ?? []),
  ...(step.refs ?? []).flatMap((ref) => (ref.tabs ?? []).flatMap((tab) => tab.links ?? [])),
];
// Route paths a map declares (maps/<map>/routes/*.jsx), e.g. bows, fire, cogs/1.
const routePaths = (slug) => {
  const dir = resolve(root, 'maps', slug, 'routes');
  const source = readdirSync(dir).map((file) => readFileSync(resolve(dir, file), 'utf8')).join('\n');
  return new Set([...source.matchAll(/path="([^"*]+)"/g)].map(([, path]) => path));
};

test('main guides are flat step lists (known leftovers may only shrink)', () => {
  for (const { guide, steps } of guides) {
    const found = new Set(steps.flatMap(notFlat));
    const known = new Set(allowed[guide] ?? []);
    const added = [...found].filter((item) => !known.has(item));
    const fixed = [...known].filter((item) => !found.has(item));
    assert.deepEqual(added, [], `${guide}: the main guide stays flat (title, one short line, a details link); move this to the tab that owns it: ${added.join(', ')}`);
    assert.deepEqual(fixed, [], `${guide}: now flat; remove from scripts/fixtures/main-guide-flat.json: ${fixed.join(', ')}`);
  }
});

test('every step link goes to a real tab of its map', () => {
  for (const { guide, route, steps } of guides) {
    const paths = routePaths(guide);
    for (const step of steps) {
      for (const link of stepLinks(step)) {
        const where = `${guide} step "${step.id}" → ${link.to}`;
        assert(link.to.startsWith(`${route}/`), `${where}: a step links to its own map's tabs`);
        const rel = link.to.slice(route.length + 1).split(/[?#]/)[0];
        assert(paths.has(rel) || rel.split('/').every((part) => paths.has(part)), `${where}: no such tab route`);
        assert(link.label, `${where}: has a label`);
        if (link.section !== undefined) assert.match(link.section, SECTION_ID, `${where}: section is an element id`);
      }
    }
  }
});

test('step → tab → step round trip', () => {
  const steps = [{ id: 'upgrade-bow', title: 'Upgrade your bow' }, { id: 'boss', title: 'Boss' }];
  const href = stepLinkHref({ to: '/maps/der-eisendrache/bows/fire', section: 'parts' }, 'upgrade-bow');
  assert.equal(href, `/maps/der-eisendrache/bows/fire?${FROM_PARAM}=upgrade-bow#parts`);
  assert.equal(stepLinkHref({ to: '/maps/x/tab?a=1#old' }, 'boss'), `/maps/x/tab?a=1&${FROM_PARAM}=boss#old`, 'keeps an existing query and hash');
  assert.equal(stepLinkHref({ to: '/maps/x/tab' }, '<script>'), '/maps/x/tab', 'an odd step id is not put in the link');
  assert.deepEqual(stepOrigin(`?${FROM_PARAM}=boss`, steps), { step: steps[1], number: 2 });
  assert.equal(stepOrigin(`?${FROM_PARAM}=not-a-step`, steps), null, 'only a real step gets a back link');
  assert.equal(stepOrigin('', steps), null);
});
