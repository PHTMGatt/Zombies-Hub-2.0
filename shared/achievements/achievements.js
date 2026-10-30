import { GUIDE_PREFIX, progressKey, read, remove, storedKeys, write } from '../storage';

/*
 * Zombies Hub achievements and local progress, all kept in this browser (localStorage).
 *
 * Two separate records:
 *   run progress        – each guide's `zh-guide-progress:<guideId>` record plus per-map tool notes.
 *   achievement history – `zh-achievements`: { v: 1, unlocked: { [achievementId]: { at: ISO date } } }.
 * Resetting a run never touches achievement history; "Reset achievements" is its own explicit action.
 *
 * Achievement ids are `<mapId>/<name>` and carry a `kind`, so side Easter Eggs, speedruns, wonder
 * weapons and challenges can be added to ACHIEVEMENTS later without changing the stored shape.
 */
const ACHIEVEMENTS_KEY = 'zh-achievements';
const SETTINGS_KEY = 'zh-settings';
export const UNLOCK_EVENT = 'zh-achievement-unlock';
export const CHANGE_EVENT = 'zh-achievements-change';
export const PROGRESS_RESET_EVENT = 'zh-progress-reset';

/*
 * The seven dedicated maps. `guideId` is the tracked guide (null until the map has one); `keys` are the
 * map's other saved run notes (cleared by "Reset map", kept out of achievement history).
 * Accents match each map's guide theme.
 */
export const MAPS = {
  origins: { name: 'Origins', accent: '#6dc2ff', route: '/maps/origins', guideId: 'origins', keys: [] },
  'mob-of-the-dead': { name: 'Mob of the Dead', accent: '#f0b321', route: '/maps/mob-of-the-dead', guideId: 'mob-of-the-dead', keys: [] },
  'shadows-of-evil': { name: 'Shadows of Evil', accent: '#aa79df', route: '/maps/shadows-of-evil', guideId: null, keys: [] },
  'der-eisendrache': { name: 'Der Eisendrache', accent: '#7bcfff', route: '/maps/der-eisendrache', guideId: 'der-eisendrache', keys: ['zh-de-safe-code'] },
  'zetsubou-no-shima': { name: 'Zetsubou No Shima', accent: '#69e6ad', route: '/maps/zetsubou-no-shima', guideId: null, keys: [] },
  'gorod-krovi': { name: 'Gorod Krovi', accent: '#ff7a52', route: '/maps/gorod-krovi', guideId: 'gorod-krovi', keys: [] },
  revelations: { name: 'Revelations', accent: '#8fe3ff', route: '/maps/revelations', guideId: null, keys: [] },
};

/*
 * Titles are the Easter Egg names the repo already uses for each map (Shadows of Evil has none, so it
 * stays generic). `legacyKey` counts an unlock recorded before this system existed.
 */
export const ACHIEVEMENTS = [
  { id: 'origins/main', map: 'origins', kind: 'main-ee', title: 'Little Lost Girl' },
  { id: 'mob-of-the-dead/main', map: 'mob-of-the-dead', kind: 'main-ee', title: 'Pop Goes the Weasel' },
  { id: 'shadows-of-evil/main', map: 'shadows-of-evil', kind: 'main-ee', title: 'Main Easter Egg' },
  { id: 'der-eisendrache/main', map: 'der-eisendrache', kind: 'main-ee', title: 'My Brother’s Keeper' },
  { id: 'zetsubou-no-shima/main', map: 'zetsubou-no-shima', kind: 'main-ee', title: 'Seeds of Doubt' },
  { id: 'gorod-krovi/main', map: 'gorod-krovi', kind: 'main-ee', title: 'Love and War' },
  { id: 'revelations/main', map: 'revelations', kind: 'main-ee', title: 'For The Good Of All' },
  {
    id: 'origins/speedrun-unlocked',
    map: 'origins',
    kind: 'secret',
    hidden: true,
    title: 'Speedrun Difficulty Unlocked',
    legacyKey: 'zh-origins-speedrun-unlocked',
  },
];

export const achievementById = (id) => ACHIEVEMENTS.find((item) => item.id === id);
export const mainAchievementFor = (mapId) => ACHIEVEMENTS.find((item) => item.map === mapId && item.kind === 'main-ee');

const readRecord = () => {
  const saved = read(ACHIEVEMENTS_KEY, null);
  return saved && typeof saved.unlocked === 'object' && saved.unlocked ? saved : null;
};

// Unlocks made while storage is blocked, so the popup still only shows once per visit.
const sessionUnlocks = {};

// { [id]: { at: ISO date | null } }. A legacy unlock (no date) counts only until the first record is
// written; after that, including after "Reset achievements", the record is the single source of truth.
export function getUnlocked() {
  const record = readRecord();
  const unlocked = { ...sessionUnlocks, ...(record?.unlocked ?? {}) };
  if (!record) {
    ACHIEVEMENTS.forEach((item) => {
      if (!unlocked[item.id] && item.legacyKey && read(item.legacyKey, false) === true) unlocked[item.id] = { at: null };
    });
  }
  return unlocked;
}

const announceChange = () => window.dispatchEvent(new Event(CHANGE_EVENT));

// Legacy unlocks are carried into the first written record so they are not lost when it takes over.
const withoutLegacyDates = (unlocked) => Object.fromEntries(Object.entries(unlocked).map(([key, value]) => [key, { at: value.at ?? null }]));

/*
 * Records an unlock once. Returns true only the first time, and only then fires the toast event, so a
 * reload or a second completion never repeats the popup.
 */
export function unlockAchievement(id) {
  const achievement = achievementById(id);
  if (!achievement) return false;
  const unlocked = getUnlocked();
  if (unlocked[id]) return false;
  const entry = { at: new Date().toISOString() };
  sessionUnlocks[id] = entry;
  write(ACHIEVEMENTS_KEY, { v: 1, unlocked: { ...(readRecord()?.unlocked ?? {}), ...withoutLegacyDates(unlocked), [id]: entry } });
  window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, { detail: { id } }));
  announceChange();
  return true;
}

// Guide progress summary for the shelf: { done, total } from the saved record (total is written by the guide).
export function guideProgress(mapId) {
  const guideId = MAPS[mapId]?.guideId;
  if (!guideId) return null;
  const saved = read(progressKey(guideId), null);
  const total = saved?.total ?? null;
  if (!saved?.done) return { done: 0, total };
  const done = Object.keys(saved.done).filter((key) => !key.includes('/') && saved.done[key]).length;
  // A step removed from a guide can linger in an old record; never report more than the guide has.
  return { done: total ? Math.min(done, total) : done, total };
}

/* ---- Resets. Each one names exactly what it clears; none of them touches achievement history. ---- */

export function resetMap(mapId) {
  const map = MAPS[mapId];
  if (!map) return;
  if (map.guideId) remove(progressKey(map.guideId));
  map.keys.forEach(remove);
  window.dispatchEvent(new CustomEvent(PROGRESS_RESET_EVENT, { detail: { mapId, guideId: map.guideId } }));
  announceChange();
}

export function resetAllProgress() {
  storedKeys().filter((key) => key.startsWith(GUIDE_PREFIX)).forEach(remove);
  Object.values(MAPS).forEach((map) => map.keys.forEach(remove));
  window.dispatchEvent(new CustomEvent(PROGRESS_RESET_EVENT, { detail: { all: true } }));
  announceChange();
}

// Erases achievement history. An empty record (not a missing one) stays behind so legacy flags such as
// Origins' speedrun unlock no longer count; the features those flags unlock are left alone.
export function resetAchievements() {
  Object.keys(sessionUnlocks).forEach((id) => delete sessionUnlocks[id]);
  write(ACHIEVEMENTS_KEY, { v: 1, unlocked: {} });
  announceChange();
}

/* ---- Preferences ---- */

export const soundEnabled = () => read(SETTINGS_KEY, {})?.sound !== false;

export function setSoundEnabled(on) {
  write(SETTINGS_KEY, { ...read(SETTINGS_KEY, {}), sound: Boolean(on) });
  announceChange();
}
