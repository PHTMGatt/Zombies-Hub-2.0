import assert from 'node:assert/strict';
import test from 'node:test';
import { HUNT_KEYS, huntReducer, initialPick, keyAction, neighbours, normalizeHunt, optionProps, pickParam } from '../shared/hunt/hunt.js';
import { huntFixture } from './fixtures/hunt-fixture.mjs';

const hunt = normalizeHunt(huntFixture);
const reduce = huntReducer(hunt);

test('normalizeHunt keeps order and rejects data a picker cannot show', () => {
  assert.deepEqual(hunt.sets.map((set) => set.id), ['kino', 'shang', 'origins']);
  assert.equal(hunt.sets[0].items.length, 2);
  assert.equal(hunt.sets[0].items[0].label, 'Front of the stage');
  assert.equal(hunt.sets[0].items[0].start, 399, 'extra fields pass through untouched');
  assert.throws(() => normalizeHunt([]), /no sets/);
  assert.throws(() => normalizeHunt([{ id: 'a', label: 'A', items: [] }]), /set "a" has no items/);
  assert.throws(() => normalizeHunt([{ id: 'a', label: 'A', items: [{ id: 'x', label: 'X' }] }, { id: 'a', label: 'B', items: [{ id: 'y', label: 'Y' }] }]), /duplicate set id "a"/);
  assert.throws(() => normalizeHunt([{ id: 'a', label: 'A', items: [{ id: 'x', label: 'X' }, { id: 'x', label: 'X2' }] }]), /duplicate item id "x" in set "a"/);
  assert.throws(() => normalizeHunt([{ id: 'a', label: '', items: [{ id: 'x', label: 'X' }] }]), /set "a" has no label/);
  assert.throws(() => normalizeHunt([{ id: 'a.b', label: 'A', items: [{ id: 'x', label: 'X' }] }]), /id "a.b" must be a slug/);
});

test('?pick deep links: set, set.item, and anything unknown falls back to the first set', () => {
  assert.deepEqual(initialPick(hunt, ''), { setId: 'kino', itemId: null });
  assert.deepEqual(initialPick(hunt, '?pick=shang'), { setId: 'shang', itemId: null });
  assert.deepEqual(initialPick(hunt, '?pick=shang.stamin-up'), { setId: 'shang', itemId: 'stamin-up' });
  assert.deepEqual(initialPick(hunt, '?pick=shang.nowhere'), { setId: 'shang', itemId: null }, 'unknown item keeps the set');
  assert.deepEqual(initialPick(hunt, '?pick=atlantis'), { setId: 'kino', itemId: null });
  assert.deepEqual(initialPick(hunt, '?pick=%E0%A4%A'), { setId: 'kino', itemId: null }, 'malformed escapes do not throw');
  assert.equal(pickParam({ setId: 'shang', itemId: null }), 'shang');
  assert.equal(pickParam({ setId: 'shang', itemId: 'stamin-up' }), 'shang.stamin-up');
});

test('choosing a set clears the item; choosing an item keeps its set', () => {
  let state = initialPick(hunt, '?pick=kino.stage');
  state = reduce(state, { type: 'set', id: 'origins' });
  assert.deepEqual(state, { setId: 'origins', itemId: null });
  state = reduce(state, { type: 'item', id: 'vmp' });
  assert.deepEqual(state, { setId: 'origins', itemId: 'vmp' });
  assert.equal(reduce(state, { type: 'item', id: 'stage' }), state, 'an item from another set is ignored');
  assert.equal(reduce(state, { type: 'set', id: 'atlantis' }), state, 'an unknown set is ignored');
});

test('next/prev walk every item across sets in order and stop at the ends', () => {
  let state = initialPick(hunt, '');
  const walk = [];
  for (let i = 0; i < 7; i += 1) {
    state = reduce(state, { type: 'next' });
    walk.push(pickParam(state));
  }
  assert.deepEqual(walk, ['kino.stage', 'kino.balcony', 'shang.stamin-up', 'shang.fire-pit', 'origins.vmp', 'origins.vmp', 'origins.vmp']);
  state = reduce(state, { type: 'prev' });
  assert.equal(pickParam(state), 'shang.fire-pit');
  assert.equal(pickParam(reduce({ setId: 'kino', itemId: 'stage' }, { type: 'prev' })), 'kino.stage', 'first item stays');
  assert.deepEqual(neighbours(hunt, { setId: 'shang', itemId: 'stamin-up' }), {
    prev: { setId: 'kino', itemId: 'balcony', label: 'Higher balcony' },
    next: { setId: 'shang', itemId: 'fire-pit', label: 'Fire pit' },
  });
  assert.deepEqual(neighbours(hunt, { setId: 'kino', itemId: null }), { prev: null, next: { setId: 'kino', itemId: 'stage', label: 'Front of the stage' } });
});

test('keyboard: arrows, Home and End move within a group the way a radio group does', () => {
  const sets = hunt.sets.map((set) => set.id);
  assert.deepEqual(keyAction('ArrowRight', sets, 'kino'), { id: 'shang' });
  assert.deepEqual(keyAction('ArrowDown', sets, 'kino'), { id: 'shang' });
  assert.deepEqual(keyAction('ArrowLeft', sets, 'kino'), { id: 'origins' }, 'wraps like a native radio group');
  assert.deepEqual(keyAction('ArrowUp', sets, 'origins'), { id: 'shang' });
  assert.deepEqual(keyAction('Home', sets, 'origins'), { id: 'kino' });
  assert.deepEqual(keyAction('End', sets, 'kino'), { id: 'origins' });
  assert.deepEqual(keyAction('ArrowRight', sets, null), { id: 'kino' }, 'nothing chosen yet: first');
  assert.equal(keyAction('a', sets, 'kino'), null);
  assert.deepEqual(HUNT_KEYS, ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']);
});

test('optionProps: radio semantics with one tab stop per group', () => {
  const picked = [];
  const props = (id, current, ids) => optionProps({ id, current, ids, onPick: (next) => picked.push(next) });
  const on = props('shang', 'shang', ['kino', 'shang']);
  assert.equal(on.role, 'radio');
  assert.equal(on['aria-checked'], true);
  assert.equal(on.tabIndex, 0);
  assert.equal(on['data-hunt-id'], 'shang');
  const off = props('kino', 'shang', ['kino', 'shang']);
  assert.equal(off['aria-checked'], false);
  assert.equal(off.tabIndex, -1);
  assert.equal(props('kino', null, ['kino', 'shang']).tabIndex, 0, 'nothing chosen: the first option takes the tab stop');
  off.onClick();
  let prevented = false;
  on.onKeyDown({ key: 'End', preventDefault: () => { prevented = true; } });
  on.onKeyDown({ key: 'x', preventDefault: () => { throw new Error('other keys pass through'); } });
  assert.deepEqual(picked, ['kino', 'shang']);
  assert.equal(prevented, true, 'arrow keys do not scroll the page');
});


test('every Revelations hunt loads into the picker with the counts the hunt data promises', async () => {
  const { revHunts } = await import('../maps/revelations/src/data/huntSets.js');
  const { huntCounts } = await import('../maps/revelations/src/data/huntData.js');
  const count = (hunt) => hunt.sets.reduce((sum, set) => sum + set.items.length, 0);
  assert.equal(count(revHunts.bones), huntCounts.bones);
  assert.equal(count(revHunts.eggs), huntCounts.eggs);
  assert.equal(revHunts.eggs.sets.length, huntCounts.eggSets);
  assert.equal(count(revHunts.runes), huntCounts.runes);
  assert.equal(revHunts.runes.sets.length, huntCounts.runeSets);
  assert.equal(count(revHunts.throws), huntCounts.throws);
  assert.equal(count(revHunts.rocks), 5, 'five Servant rocks');
  for (const [name, hunt] of Object.entries(revHunts)) {
    for (const item of hunt.sets.flatMap((set) => set.items)) assert(item.label, `${name}: ${item.id} has a label`);
  }
});
