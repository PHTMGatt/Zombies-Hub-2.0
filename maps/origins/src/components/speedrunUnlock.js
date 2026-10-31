import { useCallback, useEffect, useState } from 'react';
import { read as readStored, write as writeStored } from '../../../../shared/storage';
import { unlockAchievement } from '../../../../shared/achievements/achievements';

/*
 * Remembers that the Electrical Panel was solved (so it stays solved) and records the hidden
 * "Electrical Panel Solved" achievement. It unlocks nothing: Speed Run is always open. The storage key and
 * achievement id keep their old "speedrun" names so earlier solves and earned records survive.
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
    // re-earns it only after "Reset achievements" (the panel itself stays solved).
    unlockAchievement('origins/speedrun-unlocked');
    writeStored(KEY, true);
    setUnlocked(true);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { unlocked, unlock };
}

