import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SwitchDial, { DIRECTION_ANGLE } from './SwitchDial';
import { playSet, playTurn } from './switchSounds';
import { useSpeedrunUnlock } from './speedrunUnlock';
import { write as writeStored } from '../../../../shared/storage';
import { originsLightningSwitchRoute } from '../../../../shared/data/originsLightning';
import '../Styles/ComponentStyles/ElectricalPanel.css';

/*
 * The Origins secret. Seven unlabeled switches start at their untouched in-game positions; each tap turns
 * one a quarter clockwise, so each needs the same number of turns as in the game (Spawn ×2, Gen 2 ×3 …).
 * Like the real dials, a switch stops sparking once it sits in its Lightning Staff position. Bring all
 * seven live and Speedrun mode unlocks. The answer is on the page above — you just have to apply it.
 */
export default function ElectricalPanel() {
  const { unlocked, unlock } = useSpeedrunUnlock();
  const [open, setOpen] = useState(false);
  const [angles, setAngles] = useState(() =>
    originsLightningSwitchRoute.map((item) => DIRECTION_ANGLE[item.direction] - item.turnsFromUntouched * 90),
  );
  const [justSolved, setJustSolved] = useState(false);

  const isLive = (index) => {
    const delta = angles[index] - DIRECTION_ANGLE[originsLightningSwitchRoute[index].direction];
    return ((delta / 90) % 4 + 4) % 4 === 0;
  };
  const live = originsLightningSwitchRoute.filter((_, index) => isLive(index)).length;
  const total = originsLightningSwitchRoute.length;

  const turn = (index) => {
    const next = angles.map((angle, i) => (i === index ? angle + 90 : angle));
    setAngles(next);
    const solved = originsLightningSwitchRoute.every((item, i) =>
      ((((next[i] - DIRECTION_ANGLE[item.direction]) / 90) % 4) + 4) % 4 === 0);
    if (solved && !unlocked) {
      unlock();
      setJustSolved(true);
      playSet();
    } else {
      playTurn();
    }
  };

  const openSpeedrunMode = () => writeStored('zh-origins-depth', 'speedrun');
  const complete = unlocked || justSolved;

  return (
    <section className={`electrical-panel${open ? ' is-open' : ''}${complete ? ' is-complete' : ''}`}>
      <button
        type="button"
        className="electrical-panel__toggle"
        aria-expanded={open}
        aria-controls="electrical-panel-board"
        onClick={() => setOpen(!open)}
      >
        <span className="electrical-panel__bolt" aria-hidden="true">⚡</span>
        <span className="electrical-panel__copy">
          <strong>Electrical Panel</strong>
          <small>{complete ? 'The circuit holds.' : 'The current remembers.'}</small>
        </span>
        <span className="electrical-panel__chevron" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="electrical-panel__board" id="electrical-panel-board">
          {complete ? (
            <div className="electrical-panel__reward" role="status">
              <span className="electrical-panel__reward-kicker">Circuit complete</span>
              <strong>Speedrun Difficulty Unlocked</strong>
              <p>A fourth depth now sits beside Low, Medium and High in the Origins guide.</p>
              <div className="electrical-panel__reward-links">
                <Link to="/maps/origins" onClick={openSpeedrunMode}>Open Speedrun mode →</Link>
                <Link to="/maps/origins/speed-run">Straight to the route →</Link>
              </div>
            </div>
          ) : (
            <>
              <p className="electrical-panel__status" role="status">
                <span>{live} / {total}</span> switches live
              </p>
              <ul className="electrical-panel__grid">
                {originsLightningSwitchRoute.map((item, index) => {
                  const ok = isLive(index);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`electrical-switch${ok ? ' is-live' : ''}`}
                        aria-label={`${item.shortLabel} switch, ${ok ? 'live' : 'sparking'}. Turn a quarter clockwise.`}
                        onClick={() => turn(index)}
                      >
                        <span className="electrical-switch__dial">
                          <SwitchDial angle={angles[index]} size={58} />
                          {!ok && <span className="electrical-switch__spark" aria-hidden="true" />}
                        </span>
                        <span className="electrical-switch__label">{item.shortLabel}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
