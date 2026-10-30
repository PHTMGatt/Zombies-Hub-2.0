import React, { useEffect, useId, useState } from 'react';
import { PROGRESS_RESET_EVENT } from '../achievements/achievements';
import { read, write } from '../storage';

/*
 * A tiny notepad for something the game randomises (train symbols, a safe code…), placed in the step
 * where the information appears. Kept in this browser until cleared; "Reset map" / "Reset all progress"
 * clear it too (list its storageKey in that map's MAPS.keys). Every copy with the same key stays in sync,
 * so the note in a step and in the Quick refs sheet never overwrite each other.
 *
 * Props: storageKey, mapId, label, hint (e.g. "in order"), slots (labels for each field), placeholder.
 */
const SYNC_EVENT = 'zh-run-note-change';

export default function RunNote({ storageKey, mapId, label, hint, slots, placeholder = 'symbol' }) {
  const empty = slots.map(() => '');
  const load = () => {
    const saved = read(storageKey, empty);
    return Array.isArray(saved) && saved.length === slots.length ? saved : empty;
  };
  const [values, setValues] = useState(load);
  const id = useId();

  useEffect(() => {
    const sync = (event) => {
      if (!event.detail || event.detail.key === storageKey) setValues(load());
    };
    const onReset = (event) => {
      const { all, mapId: target } = event.detail ?? {};
      if (all || target === mapId) setValues(empty);
    };
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener(PROGRESS_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener(PROGRESS_RESET_EVENT, onReset);
    };
  }, [storageKey, mapId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (index, value) => {
    const next = values.map((slot, i) => (i === index ? value : slot));
    setValues(next);
    write(storageKey, next);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: storageKey } }));
  };

  const clear = () => {
    setValues(empty);
    write(storageKey, empty);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: storageKey } }));
  };

  return (
    <div className="run-note">
      <span className="gref__label">{label} {hint && <small>{hint}</small>}</span>
      <ol className="run-note__slots">
        {slots.map((slotLabel, index) => (
          <li key={slotLabel}>
            <label htmlFor={`${id}-${index}`}>{slotLabel}</label>
            <input
              id={`${id}-${index}`}
              type="text"
              value={values[index]}
              placeholder={placeholder}
              autoComplete="off"
              maxLength={40}
              onChange={(event) => update(index, event.target.value)}
            />
          </li>
        ))}
      </ol>
      {values.some(Boolean) && (
        <button type="button" className="run-note__clear" onClick={clear}>Clear for a new game</button>
      )}
    </div>
  );
}
