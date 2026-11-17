/*
 * Revelations hunts in the shape the headless picker reads (shared/hunt/hunt.js): sets of items, slug ids,
 * labels from the hunt records. Data only, no new facts: everything comes from huntData.js and
 * ApothiconUpgradeData.js. Each item keeps its whole record (landmark, video, shot, check, gaps).
 */
import { normalizeHunt } from '../../../../shared/hunt/hunt.js';
import { bones, eggSets, eggs, runeSets, runes, throwsTargets, HUNT_VIDEO } from './huntData.js';
import upgradeData from './ApothiconUpgradeData.js';

const slug = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const asItem = (record) => ({ ...record, label: record.landmark });

export const revHunts = {
  rocks: normalizeHunt([{
    id: 'rocks', label: 'Servant rocks',
    items: upgradeData.map((row, i) => ({ id: slug(row.name), label: row.name, order: i + 1, video: { id: HUNT_VIDEO.id, start: row.start, end: row.end } })),
  }]),
  bones: normalizeHunt([{ id: 'bones', label: 'Bones', items: bones.map((bone) => ({ ...asItem(bone), label: bone.area })) }]),
  eggs: normalizeHunt(eggSets.map((set) => ({ id: set.id, label: set.name, video: set.video, items: eggs.filter((egg) => egg.setIndex === set.order).map(asItem) }))),
  runes: normalizeHunt(runeSets.map((set) => ({ id: set.id, label: set.name, items: runes.filter((rune) => rune.setIndex === set.order).map(asItem) }))),
  throws: normalizeHunt([{ id: 'targets', label: 'Throw targets', items: throwsTargets.map(asItem) }]),
};
