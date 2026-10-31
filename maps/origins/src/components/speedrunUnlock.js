import { useCallback, useEffect, useState } from 'react';
import { read as readStored, write as writeStored } from '../../../../shared/storage';
import { unlockAchievement } from '../../../../shared/achievements/achievements';

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
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const unlock = useCallback(() => {
    // Also a hidden achievement. unlockAchievement is a no-op once recorded, so solving the panel again
    // re-earns it only after "Reset achievements" (which keeps Speedrun mode itself unlocked).
    unlockAchievement('origins/speedrun-unlocked');
    writeStored(KEY, true);
    setUnlocked(true);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { unlocked, unlock };
}

