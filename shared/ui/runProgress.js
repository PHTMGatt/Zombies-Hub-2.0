// Saved Easter Egg run progress: the done phase indexes for one run, kept in
// localStorage. Progress is per-browser convenience only, so every storage call
// is allowed to fail. `storage` is injectable for tests; it defaults to the
// browser's localStorage, read inside the try because touching it can throw.

export const storageKey = (runId) => `zh-run-progress:${runId}`;

export function readProgress(runId, total, storage) {
  try {
    const store = storage ?? window.localStorage;
    const parsed = JSON.parse(store.getItem(storageKey(runId)) || '[]');
    return Array.isArray(parsed) ? parsed.filter((i) => Number.isInteger(i) && i >= 0 && i < total) : [];
  } catch {
    return [];
  }
}

export function writeProgress(runId, done, storage) {
  try {
    const store = storage ?? window.localStorage;
    if (done.length) store.setItem(storageKey(runId), JSON.stringify(done));
    else store.removeItem(storageKey(runId));
  } catch {
    // Private mode or blocked storage: progress just won't survive a reload.
  }
}
