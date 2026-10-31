import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEARCH_ENTRIES, search } from '../shared/search/searchIndex.js';

const root = resolve(import.meta.dirname, '..');
const STEP_FILES = {
  origins: 'maps/origins/src/data/originsGuide.jsx',
  'mob-of-the-dead': 'maps/mob-of-the-dead/src/data/mobGuideSteps.jsx',
  'shadows-of-evil': 'maps/shadows-of-evil/src/data/soeGuideSteps.jsx',
  'der-eisendrache': 'maps/der-eisendrache/src/data/deGuideSteps.jsx',
  'zetsubou-no-shima': 'maps/zetsubou-no-shima/src/data/zetsGuideSteps.jsx',
  'gorod-krovi': 'maps/gorod-krovi/src/data/gorodGuideSteps.jsx',
  revelations: 'maps/revelations/src/data/revGuideSteps.jsx',
};

test('every search entry that opens a guide reference points at a step that exists', () => {
  for (const entry of SEARCH_ENTRIES.filter((item) => item.stepId)) {
    const source = readFileSync(resolve(root, STEP_FILES[entry.map]), 'utf8');
    // A step is an object whose id is followed by its title (task ids are followed by label instead).
    assert.match(source, new RegExp(`id: '${entry.stepId}',\\s*\\n\\s*title:`), `${entry.map} has no step "${entry.stepId}" (search: ${entry.title})`);
  }
});

test('search results for a guide step link straight to that step (#step-id), not a ?ref sheet', () => {
  for (const entry of SEARCH_ENTRIES.filter((item) => item.stepId)) {
    assert.match(entry.to, /^\/maps\/[a-z-]+#[a-z0-9-]+$/, `${entry.title} links to ${entry.to}`);
    assert.equal(entry.to, `/maps/${entry.map}#${entry.stepId}`, `${entry.title} links to its own step`);
  }
});

test('player-language queries land on the right reference first', () => {
  const top = (query) => search(query)[0];
  const cases = [
    ['ice staff code', 'origins', 'Staff build codes'],
    ['gorod valves', 'gorod-krovi', 'Valve Solver'],
    ['mob plane parts', 'mob-of-the-dead', 'Plane parts'],
    ['DE wisps', 'der-eisendrache', 'Wisps'],
    ['soe train symbols', 'shadows-of-evil', 'Train symbols notepad + rituals'],
    ['gk trophies', 'gorod-krovi', 'Six trophies'],
    ['zetsubou gas mask', 'zetsubou-no-shima', 'Shield + Gas Mask parts'],
    ['revelations bones', 'revelations', 'Six bones'],
    ['mob codes', 'mob-of-the-dead', 'Afterlife codes 101 · 386 · 872 · 481'],
    ['where are the dog heads', 'mob-of-the-dead', 'Cerberus heads + Hell’s Retriever'],
    ['void bow', 'der-eisendrache', 'Bow upgrades (Storm · Fire · Wolf · Void)'],
    ['kino reels', 'kino', 'Film reels + radios'],
    ['verrückt servant', 'revelations', 'Apothicon Servant blue rocks'],
  ];
  for (const [query, map, title] of cases) {
    const hit = top(query);
    assert(hit, `"${query}" found nothing`);
    assert.equal(`${hit.map} · ${hit.title}`, `${map} · ${title}`, `"${query}"`);
  }
});

test('a map name alone lists that map, guide first among its results', () => {
  const results = search('gorod');
  assert(results.length > 3);
  assert(results.every((entry) => entry.map === 'gorod-krovi'));
  assert.equal(results[0].kind, 'guide');
});

test('nonsense finds nothing', () => {
  assert.deepEqual(search('zzqx'), []);
  assert.deepEqual(search(''), []);
});
