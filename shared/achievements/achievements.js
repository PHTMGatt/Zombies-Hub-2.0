import { GUIDE_PREFIX, progressKey, read, remove, storedKeys, write } from '../storage';

/*
 * Zombies Hub achievements, kept in this browser (localStorage):
 *   `zh-achievements`: { v: 1, unlocked: { [achievementId]: { at: ISO date | null } },
 *                        checked: [mapIds already credited or reset] }.
 * A main Easter Egg is recorded by the player's own "I completed this Easter Egg" tap. Guides keep no
 * step progress; old `zh-guide-progress:*` records are read once to credit finished runs, then ignored.
 * Saved in-game notes (MAPS[*].keys) belong to their tools and are never cleared from here.
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
 * The seven dedicated maps. `guideId` names the map's old step-progress record (read only for the one-time
 * legacy credit); `keys` lists the map's saved in-game notes, which stay until their own tool clears them.
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

/* ---- Old step-progress records (from before guides dropped progress tracking) ---- */

const LEGACY_CHECKED_KEY = 'zh-legacy-progress-checked';
const LEGACY_KEYS = ['zh-guide-mode', 'zh-origins-depth', LEGACY_CHECKED_KEY];

const legacyRunFinished = (guideId) => {
  const saved = read(progressKey(guideId), null);
  if (!saved?.total || !saved.done) return false;
  const done = Object.keys(saved.done).filter((key) => !key.includes('/') && saved.done[key]).length;
  return done >= saved.total;
};

/*
 * Once per browser: credit every map whose old progress record shows the whole Easter Egg done, silently,
 * through backfillAchievement (which also respects "Reset achievements"). Returns how many were credited.
 */
export function backfillLegacyMainAchievements() {
  if (read(LEGACY_CHECKED_KEY, false) === true) return 0;
  let credited = 0;
  Object.entries(MAPS).forEach(([mapId, map]) => {
    const achievement = mainAchievementFor(mapId);
    if (map.guideId && achievement && legacyRunFinished(map.guideId) && backfillAchievement(achievement.id)) credited += 1;
  });
  write(LEGACY_CHECKED_KEY, true);
  return credited;
}

// "Clear old guide data": removes only records of the retired progress and mode machinery. Achievements
// and saved in-game notes (character picks, symbols, safe codes) stay.
export function clearOldGuideData() {
  storedKeys().filter((key) => key.startsWith(GUIDE_PREFIX)).forEach(remove);
  LEGACY_KEYS.forEach(remove);
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
