/*
 * Guarded localStorage access for every Zombies Hub record. Private windows or blocked storage just
 * mean nothing persists; callers always get their fallback instead of an exception.
 */
export const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const remove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing stored to clear.
  }
};

export const storedKeys = () => {
  try {
    return Object.keys(window.localStorage);
  } catch {
    return [];
  }
};

// One record per tracked guide: { current, done, total }.
export const GUIDE_PREFIX = 'zh-guide-progress:';
export const progressKey = (guideId) => `${GUIDE_PREFIX}${guideId}`;
