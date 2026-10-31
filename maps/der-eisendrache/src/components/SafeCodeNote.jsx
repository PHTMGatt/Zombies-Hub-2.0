import React, { useEffect, useState } from 'react';
import { read as readStored, write as writeStored } from '../../../../shared/storage';
import { PROGRESS_RESET_EVENT } from '../../../../shared/achievements/achievements';

/*
 * Dr. Groph's safe code changes every game, and you read it in the past but enter it in the present.
 * Three quick slots to jot the symbols top → bottom; kept in this browser until cleared.
 */
const KEY = 'zh-de-safe-code';
const EMPTY = ['', '', ''];
const SYNC_EVENT = 'zh-de-safe-code-change';

export default function SafeCodeNote() {
  const [slots, setSlots] = useState(() => {
    const saved = readStored(KEY, EMPTY);
    return Array.isArray(saved) && saved.length === 3 ? saved : EMPTY;
  });

  // Every copy of the note (in the step and in the Quick refs sheet) shares one record and stays in sync.
  useEffect(() => {
    const saved = readStored(KEY, EMPTY);
    if (JSON.stringify(saved) === JSON.stringify(slots)) return;
    writeStored(KEY, slots);
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, [slots]);

  useEffect(() => {
    const sync = () => {
      const saved = readStored(KEY, EMPTY);
      if (Array.isArray(saved) && saved.length === 3) setSlots((current) => (JSON.stringify(current) === JSON.stringify(saved) ? current : saved));
    };
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  // "Reset map" / "Reset all progress" clear the note too.
  useEffect(() => {
    const onReset = (event) => {
      const { all, mapId } = event.detail ?? {};
      if (all || mapId === 'der-eisendrache') setSlots(EMPTY);
    };
    window.addEventListener(PROGRESS_RESET_EVENT, onReset);
    return () => window.removeEventListener(PROGRESS_RESET_EVENT, onReset);
  }, []);

  const update = (index, value) => setSlots((previous) => previous.map((slot, i) => (i === index ? value : slot)));

  return (
    <div className="de-safe-note">
      <span className="gref__label">Safe code · this game <small>top → bottom</small></span>
      <ol className="de-safe-note__slots">
        {slots.map((slot, index) => (
          <li key={index}>
            <label>
              <span>{index + 1}</span>
              <input
                type="text"
                value={slot}
                maxLength={24}
                placeholder="symbol…"
                autoComplete="off"
                aria-label={`Safe symbol ${index + 1}`}
                onChange={(event) => update(index, event.target.value)}
              />
            </label>
          </li>
        ))}
      </ol>
      <button type="button" className="de-safe-note__clear" onClick={() => setSlots(EMPTY)} disabled={slots.every((slot) => !slot)}>
        Clear for a new game
      </button>
    </div>
  );
}
