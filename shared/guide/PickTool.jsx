import React, { useEffect, useState } from 'react';
import { PROGRESS_RESET_EVENT } from '../achievements/achievements';
import { read, write } from '../storage';

/*
 * "Pick what the game gave you, get the answer": e.g. choose your character, see your Keeper's room.
 * The choice is remembered with the run (and cleared by the map / all-progress resets).
 * options: [{ id, label, answer }]; prompt and answerLabel frame the result.
 */
export default function PickTool({ storageKey, mapId, prompt, answerLabel, options }) {
  const [picked, setPicked] = useState(() => read(storageKey, null));
  useEffect(() => {
    const onReset = (event) => {
      const { all, mapId: target } = event.detail ?? {};
      if (all || target === mapId) setPicked(null);
    };
    window.addEventListener(PROGRESS_RESET_EVENT, onReset);
    return () => window.removeEventListener(PROGRESS_RESET_EVENT, onReset);
  }, [mapId]);

  const choose = (id) => {
    setPicked(id);
    write(storageKey, id);
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
