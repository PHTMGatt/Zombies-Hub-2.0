import assert from 'node:assert/strict';
import test from 'node:test';
import { readProgress, storageKey, writeProgress } from '../shared/ui/runProgress.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    data,
  };
}

test('saved run progress survives a reload', () => {
  const storage = memoryStorage();
  writeProgress('gorod-krovi', [0, 1], storage);

  // A reload is a fresh read of the same storage.
  assert.equal(storage.getItem(storageKey('gorod-krovi')), '[0,1]');
  assert.deepEqual(readProgress('gorod-krovi', 4, storage), [0, 1]);
});

test('progress is kept per run', () => {
  const storage = memoryStorage();
  writeProgress('gorod-krovi', [2], storage);
  assert.deepEqual(readProgress('mob-of-the-dead', 4, storage), []);
});

test('clearing progress removes the key', () => {
  const storage = memoryStorage({ [storageKey('gorod-krovi')]: '[0]' });
  writeProgress('gorod-krovi', [], storage);
  assert.equal(storage.data.has(storageKey('gorod-krovi')), false);
});

test('stored progress is sanitised against the current phase count', () => {
  const storage = memoryStorage({ [storageKey('gorod-krovi')]: '[0, 3, 7, -1, 1.5, "2"]' });
  assert.deepEqual(readProgress('gorod-krovi', 4, storage), [0, 3]);
  storage.setItem(storageKey('gorod-krovi'), 'not json');
  assert.deepEqual(readProgress('gorod-krovi', 4, storage), []);
  storage.setItem(storageKey('gorod-krovi'), '{"0":true}');
  assert.deepEqual(readProgress('gorod-krovi', 4, storage), []);
});

test('blocked storage never throws', () => {
  const blocked = {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() { throw new Error('SecurityError'); },
  };
  assert.doesNotThrow(() => writeProgress('gorod-krovi', [0], blocked));
  assert.doesNotThrow(() => writeProgress('gorod-krovi', [], blocked));
  assert.deepEqual(readProgress('gorod-krovi', 4, blocked), []);
});
