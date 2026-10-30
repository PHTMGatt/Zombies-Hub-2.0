import { GUIDE_PREFIX, progressKey, read, remove, storedKeys, write } from '../storage';

/*
 * Zombies Hub achievements and local progress, all kept in this browser (localStorage).
 *
 * Two separate records:
 *   run progress        – each guide's `zh-guide-progress:<guideId>` record plus per-map tool notes.
 *   achievement history – `zh-achievements`: { v: 1, unlocked: { [achievementId]: { at: ISO date | null } },
 *                         checked: [mapIds already credited or reset] }.
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
  'shadows-of-evil': { name: 'Shadows of Evil', accent: '#aa79df', route: '/maps/shadows-of-evil', guideId: 'shadows-of-evil', keys: ['zh-soe-train-symbols', 'zh-soe-character'] },
  'der-eisendrache': { name: 'Der Eisendrache', accent: '#7bcfff', route: '/maps/der-eisendrache', guideId: 'der-eisendrache', keys: ['zh-de-safe-code'] },
  'zetsubou-no-shima': { name: 'Zetsubou No Shima', accent: '#69e6ad', route: '/maps/zetsubou-no-shima', guideId: 'zetsubou-no-shima', keys: [] },
  'gorod-krovi': { name: 'Gorod Krovi', accent: '#ff7a52', route: '/maps/gorod-krovi', guideId: 'gorod-krovi', keys: [] },
  revelations: { name: 'Revelations', accent: '#8fe3ff', route: '/maps/revelations', guideId: 'revelations', keys: ['zh-rev-kronorium-symbols'] },
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

// Unlocks made while storage is blocked (only then), so the popup still shows once per visit.
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
  const record = readRecord();
  const saved = write(ACHIEVEMENTS_KEY, {
    v: 1,
    unlocked: { ...(record?.unlocked ?? {}), ...withoutLegacyDates(unlocked), [id]: entry },
    checked: [...new Set([...(record?.checked ?? []), achievement.map])],
  });
  if (!saved) sessionUnlocks[id] = entry;
  window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, { detail: { id } }));
  announceChange();
  return true;
}

/*
 * Credit a run that was already finished before achievements existed: once per map, silently (no popup).
 * `checked` remembers which maps were looked at, so "Reset achievements" (which marks every map
 * checked) is never undone by revisiting a finished guide.
 */
export function backfillAchievement(id) {
  const achievement = achievementById(id);
  const record = readRecord();
  if (!achievement || record?.checked?.includes(achievement.map) || getUnlocked()[id]) return false;
  write(ACHIEVEMENTS_KEY, {
    v: 1,
    unlocked: { ...(record?.unlocked ?? {}), ...withoutLegacyDates(getUnlocked()), [id]: { at: null } },
    checked: [...new Set([...(record?.checked ?? []), achievement.map])],
  });
  announceChange();
  return true;
}

// Guide progress summary for the shelf: { done, total } from the saved record (total is written by the guide).
export function guideProgress(mapId, record) {
  const guideId = MAPS[mapId]?.guideId;
  if (!guideId) return null;
  const saved = record ?? read(progressKey(guideId), null);
  const total = saved?.total ?? null;
  if (!saved?.done) return { done: 0, total };
  const done = Object.keys(saved.done).filter((key) => !key.includes('/') && saved.done[key]).length;
  // A step removed from a guide can linger in an old record; never report more than the guide has.
  return { done: total ? Math.min(done, total) : done, total };
}

// Runs under way (some progress, not finished), most recently played first, for "Continue run".
export function activeRuns() {
  return Object.entries(MAPS)
    .filter(([, map]) => map.guideId)
    .map(([mapId, map]) => {
      const saved = read(progressKey(map.guideId), null);
      const progress = guideProgress(mapId, saved);
      return { mapId, map, step: saved?.step ?? null, at: saved?.at ?? 0, ...progress };
    })
    .filter((run) => run.total && run.done < run.total && (run.done > 0 || (run.step ?? 1) > 1))
    .sort((a, b) => b.at - a.at);
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
  write(ACHIEVEMENTS_KEY, { v: 1, unlocked: {}, checked: Object.keys(MAPS) });
  announceChange();
}

/* ---- Preferences ---- */

export const soundEnabled = () => read(SETTINGS_KEY, {})?.sound !== false;

export function setSoundEnabled(on) {
  write(SETTINGS_KEY, { ...read(SETTINGS_KEY, {}), sound: Boolean(on) });
  announceChange();
}
