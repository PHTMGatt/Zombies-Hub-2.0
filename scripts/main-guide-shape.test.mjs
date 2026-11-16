// Main guide shape: the main guide is the Easter Egg steps A→Z and nothing else; the map tabs own the
// detail (media, solvers, per-staff/per-bow sets) and the steps link to them. These checks keep it that way:
// - no new tab content embedded in main-guide data (known leftovers: fixtures/main-guide-embedded.json);
// - every step link goes to a real tab route of that map, with a well-formed section id;
// - stepLinkHref / stepOrigin build and read the step ↔ tab round trip safely.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadGuides, loadModules } from './guide-content.mjs';

const root = resolve(import.meta.dirname, '..');
const EMBEDDED = new Set(['image', 'custom', 'tabs']);
const SECTION_ID = /^[a-z0-9][a-z0-9-]*$/i;
const allowed = JSON.parse(readFileSync(resolve(root, 'scripts/fixtures/main-guide-embedded.json'), 'utf8'));
const guides = (await loadGuides()).filter(({ route }) => route.startsWith('/maps/'));
const [{ stepLinkHref, stepOrigin, FROM_PARAM }] = await loadModules(['shared/guide/stepLinks.js']);

const embedded = (refs = [], path, hits = []) => {
  refs.forEach((ref) => {
    if (EMBEDDED.has(ref.type)) hits.push(`${path}:${ref.type}${ref.key ? `:${ref.key}` : ref.label ? `:${ref.label}` : ''}`);
    (ref.tabs ?? []).forEach((tab) => embedded(tab.refs, `${path}>${tab.id ?? tab.label}`, hits));
  });
  return hits;
};
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
const countBy = (list) => list.reduce((counts, item) => counts.set(item, (counts.get(item) ?? 0) + 1), new Map());

test('main-guide data embeds no new tab content (media, solvers, variant sets)', () => {
  for (const { guide, steps } of guides) {
    const found = countBy(steps.flatMap((step) => embedded(step.refs, step.id)));
    const known = countBy(allowed[guide] ?? []);
    const added = [...found].filter(([item, n]) => n > (known.get(item) ?? 0)).map(([item]) => item);
    const moved = [...known].filter(([item, n]) => n > (found.get(item) ?? 0)).map(([item]) => item);
    assert.deepEqual(added, [], `${guide}: tab content added to the main guide; put it in the map's tab and link the step to it: ${added.join(', ')}`);
    assert.deepEqual(moved, [], `${guide}: content no longer embedded; remove it from scripts/fixtures/main-guide-embedded.json: ${moved.join(', ')}`);
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
