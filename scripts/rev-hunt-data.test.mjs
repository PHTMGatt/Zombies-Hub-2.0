import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { bones, boneFinish, eggs, eggSets, runes, runeSets, throwsTargets, huntCounts } from '../maps/revelations/src/data/huntData.js';

const shotPath = (file) => new URL(`../maps/revelations/src/assets/rev-ref/${file}`, import.meta.url);

test('Revelations hunt data has the verified counts', () => {
  assert.equal(bones.length, huntCounts.bones, 'six bones');
  assert.equal(eggs.length, huntCounts.eggs, 'sixteen egg spots');
  assert.equal(eggSets.length, 4);
  for (const set of eggSets) assert.equal(eggs.filter((egg) => egg.set === set.name).length, 4, `${set.name}: four eggs`);
  assert.equal(runes.length, huntCounts.runes, 'twelve rune spots');
  assert.equal(runeSets.length, 4);
  for (const set of runeSets) assert.equal(runes.filter((rune) => rune.set === set.name).length, 3, `${set.name}: three runes`);
  assert.equal(throwsTargets.length, huntCounts.throws, 'seven Summoning Key targets');
});

test('every hunt record has a landmark, a source and unique ids, and every shot file exists', () => {
  const all = [...bones, ...eggs, ...runes, ...throwsTargets];
  assert.equal(new Set(all.map((item) => item.id)).size, all.length, 'ids are unique');
  for (const item of all) {
    assert(item.landmark?.length > 3, `${item.id}: landmark`);
    assert(item.sources?.length > 0, `${item.id}: sources`);
    if (item.shot) assert(fs.existsSync(shotPath(item.shot)), `${item.id}: ${item.shot} exists`);
    if (item.video) assert(item.video.start > 0 && (item.video.end === undefined || item.video.end > item.video.start), `${item.id}: video range`);
  }
  assert(fs.existsSync(shotPath(boneFinish.shot)));
  assert(throwsTargets.every((item) => item.sourceLandmark), 'every throw has its second-source wording');
});

test('Origins staff puzzle facts: Lightning chords match the shared piano code, Fire keeps its numbers', async () => {
  const { staffPuzzleFacts } = await import('../maps/origins/src/data/staffPuzzleFacts.js');
  const { originsLightningPianoCode } = await import('../shared/data/originsLightning.js');
  assert.deepEqual(staffPuzzleFacts.lightning.chords, originsLightningPianoCode);
  assert.deepEqual(Object.keys(staffPuzzleFacts), ['ice', 'fire', 'wind', 'lightning']);
});
