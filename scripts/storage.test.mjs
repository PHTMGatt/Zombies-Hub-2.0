import assert from 'node:assert/strict';
import test from 'node:test';

test('a failed write takes precedence over an older persisted value', async () => {
  const persisted = new Map([['run-note', JSON.stringify('stale')]]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => persisted.get(key) ?? null,
      setItem: () => { throw new DOMException('Storage quota exceeded', 'QuotaExceededError'); },
    },
  };

  const storage = await import(`../shared/storage.js?stale-write=${Date.now()}`);
  assert.equal(storage.write('run-note', 'current'), false);
  assert.equal(storage.read('run-note', null), 'current');

  delete globalThis.window;
});
