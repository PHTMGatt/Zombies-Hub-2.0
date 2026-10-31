/*
 * Guarded localStorage access for every Zombies Hub record. Private windows or blocked storage keep
 * working for the current page session; callers still get their fallback instead of an exception.
 */
const volatile = new Map();

export const read = (key, fallback) => {
  if (volatile.has(key)) return volatile.get(key);
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const write = (key, value) => {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return false;
  }
  try {
    window.localStorage.setItem(key, serialized);
    volatile.delete(key);
    return true;
  } catch {
    volatile.set(key, value);
    return false;
  }
};

export const remove = (key) => {
  volatile.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing stored to clear.
  }
};

export const storedKeys = () => {
  try {
    return [...new Set([...Object.keys(window.localStorage), ...volatile.keys()])];
  } catch {
    return [...volatile.keys()];
  }
};

// One record per tracked guide: { current, done, total }.
export const GUIDE_PREFIX = 'zh-guide-progress:';
export const progressKey = (guideId) => `${GUIDE_PREFIX}${guideId}`;
