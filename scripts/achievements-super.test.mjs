import test from 'node:test';
import assert from 'node:assert/strict';

test('Super Easter Egg is the only hidden medal and survives a complete seven-map run', async () => {
  const data = new Map();
  const events = [];
  globalThis.window = {
    localStorage: {
      getItem: key => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
      removeItem: key => data.delete(key),
    },
    dispatchEvent: event => { events.push({ type: event.type, id: event.detail?.id }); return true; },
  };
  const a = await import('../shared/achievements/achievements.js');
  assert.equal(a.ACHIEVEMENTS.filter(x => x.hidden).length, 1);
  assert.equal(a.ACHIEVEMENTS.find(x => x.hidden).id, a.SUPER_EASTER_EGG_ID);
  assert.equal(a.unlockAchievement(a.SUPER_EASTER_EGG_ID), false, 'cannot award the secret early');
  const mains = a.ACHIEVEMENTS.filter(x => x.kind === 'main-ee');
  for (const item of mains.slice(0, -1)) assert(a.unlockAchievement(item.id));
  assert.equal(a.getUnlocked()[a.SUPER_EASTER_EGG_ID], undefined, 'six maps do not unlock the trophy');
  assert(a.unlockAchievement(mains.at(-1).id));
  assert(a.getUnlocked()[a.SUPER_EASTER_EGG_ID], 'seventh map unlocks the secret');
  assert.equal(events.filter(x => x.id === a.SUPER_EASTER_EGG_ID && x.type === a.UNLOCK_EVENT).length, 1);

  const beforeReset = a.getUnlocked();
  assert(a.resetMapAchievements('origins'));
  assert(!a.getUnlocked()['origins/main']);
  assert(!a.getUnlocked()[a.SUPER_EASTER_EGG_ID], 'super trophy removed if any map is reset');
  assert(a.getUnlocked()['revelations/main'], 'other map unlock preserved');
  assert.equal(a.resetMapAchievements('invalid-map'), false, 'invalid map cannot reset anything');
  assert(a.unlockAchievement('origins/main'));
  assert(a.getUnlocked()[a.SUPER_EASTER_EGG_ID], 'super reward is earned again after restoring the last map');
  a.resetAchievements();
  assert.deepEqual(a.getUnlocked(), {}, 'reset all clears every medal without legacy replay');
  assert(beforeReset[a.SUPER_EASTER_EGG_ID]);
  delete globalThis.window;
});
