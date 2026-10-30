import React, { useEffect, useState } from 'react';
import { PROGRESS_RESET_EVENT } from '../achievements/achievements';
import { read, write } from '../storage';

/*
 * "Pick what the game gave you, get the answer": e.g. choose your character, see your Keeper's room.
 * The choice is remembered with the run (and cleared by the map / all-progress resets).
 * options: [{ id, label, answer }]; prompt and answerLabel frame the result.
 */
const SYNC_EVENT = 'zh-pick-tool-change';

export default function PickTool({ storageKey, mapId, prompt, answerLabel, options }) {
  const [picked, setPicked] = useState(() => read(storageKey, null));
  useEffect(() => {
    const onReset = (event) => {
      const { all, mapId: target } = event.detail ?? {};
      if (all || target === mapId) setPicked(null);
    };
    // Every copy (in the step and in the Quick refs sheet) shows the same choice.
    const sync = (event) => {
      if (event.detail?.key === storageKey) setPicked(read(storageKey, null));
    };
    window.addEventListener(PROGRESS_RESET_EVENT, onReset);
    window.addEventListener(SYNC_EVENT, sync);
    return () => {
      window.removeEventListener(PROGRESS_RESET_EVENT, onReset);
      window.removeEventListener(SYNC_EVENT, sync);
    };
  }, [mapId, storageKey]);

  const choose = (id) => {
    setPicked(id);
    write(storageKey, id);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: storageKey } }));
  };
  const choice = options.find((option) => option.id === picked);

  return (
    <div className="pick-tool">
      <span className="gref__label">{prompt}</span>
      <div className="pick-tool__options" role="group" aria-label={prompt}>
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={option.id === picked} onClick={() => choose(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      {choice && (
        <p className="pick-tool__answer" aria-live="polite">{answerLabel} <strong>{choice.answer}</strong></p>
      )}
    </div>
  );
}
