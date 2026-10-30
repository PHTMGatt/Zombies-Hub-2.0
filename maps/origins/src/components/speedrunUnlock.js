import { useCallback, useEffect, useState } from 'react';
import { readStored, writeStored } from '../../../../shared/guide/useGuideProgress';
import { CHANGE_EVENT, unlockAchievement } from '../../../../shared/achievements/achievements';

/*
 * Speedrun mode is a reward. It unlocks when the Little Lost Girl tracker is finished, or when the
 * Electrical Panel on the Lightning Staff page is brought fully live.
 */
const KEY = 'zh-origins-speedrun-unlocked';
const EVENT = 'zh-origins-speedrun-unlock';

export function useSpeedrunUnlock() {
  const [unlocked, setUnlocked] = useState(() => readStored(KEY, false) === true);

  useEffect(() => {
    const sync = () => setUnlocked(readStored(KEY, false) === true);
    window.addEventListener(EVENT, sync);
    window.addEventListener(CHANGE_EVENT, sync); // "Reset achievements" relocks it
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const unlock = useCallback(() => {
    // It is also a hidden achievement; that call is a no-op (no repeat popup) once recorded.
    if (readStored(KEY, false) !== true) unlockAchievement('origins/speedrun-unlocked');
    writeStored(KEY, true);
    setUnlocked(true);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { unlocked, unlock };
}

