import React, { useEffect, useState } from 'react';
import { readStored, writeStored } from '../../../../shared/guide/useGuideProgress';

/*
 * Dr. Groph's safe code changes every game, and you read it in the past but enter it in the present.
 * Three quick slots to jot the symbols top → bottom; kept in this browser until cleared.
 */
const KEY = 'zh-de-safe-code';
const EMPTY = ['', '', ''];

export default function SafeCodeNote() {
  const [slots, setSlots] = useState(() => {
    const saved = readStored(KEY, EMPTY);
    return Array.isArray(saved) && saved.length === 3 ? saved : EMPTY;
  });

  useEffect(() => {
    writeStored(KEY, slots);
  }, [slots]);

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
