import React, { useState } from 'react';
import SwitchDial, { DIRECTION_ANGLE } from './SwitchDial';
import { playSet, playTurn } from './switchSounds';
import {
  originsLightningSwitchRoute,
  originsLightningSwitchVerification,
} from '../../../../shared/data/originsLightning';
import '../Styles/ComponentStyles/SwitchBoard.css';

const ARROW = { Right: '→', Down: '↓', Left: '←', Up: '↑' };
const DIRECTIONS = ['Right', 'Down', 'Left', 'Up'];
const directionAt = (angle) => DIRECTIONS[(((angle / 90) % 4) + 4) % 4];

/*
 * The seven Lightning Staff switches as accurate dials.
 * - Final positions: the solved state at a glance (the reference view).
 * - Practice turns: each dial starts at its untouched position — worked out from the stored turn count
 *   and the chosen in-game turn direction — and every click turns it a quarter. If the starting dials
 *   match what you see untouched in-game, that turn direction is the right one.
 */
export default function LightningSwitchBoard({ extraSlot = null, showLocations = false }) {
  const [mode, setMode] = useState('final');
  const [spin, setSpin] = useState('cw');
  const [clicks, setClicks] = useState({});
  const [sound, setSound] = useState(true);

  const step = spin === 'cw' ? 90 : -90;
  const practising = mode === 'practice';
  const resetClicks = () => setClicks({});

  const switchStates = originsLightningSwitchRoute.map((item) => {
    const target = DIRECTION_ANGLE[item.direction];
    const start = target - item.turnsFromUntouched * step;
    const count = clicks[item.id] ?? 0;
    const angle = practising ? start + count * step : target;
    const remaining = (((item.turnsFromUntouched - count) % 4) + 4) % 4;
    return { item, angle, count, remaining, startDirection: directionAt(start) };
  });
  const setCount = switchStates.filter((state) => state.remaining === 0).length;

  const turn = (item, remaining) => {
    setClicks((previous) => ({ ...previous, [item.id]: (previous[item.id] ?? 0) + 1 }));
    if (!sound) return;
    if (remaining === 1) playSet();
    else playTurn();
  };

  return (
    <section className={`switch-board${practising ? ' is-practice' : ''}`} aria-label="Lightning Staff switch positions">
      <header className="switch-board__head">
        <h3>Switch Positions</h3>
        <div className="switch-board__modes" role="group" aria-label="Switch view">
          <button type="button" aria-pressed={!practising} onClick={() => setMode('final')}>Final positions</button>
          <button type="button" aria-pressed={practising} onClick={() => { resetClicks(); setMode('practice'); }}>Practice turns</button>
        </div>
      </header>

      <div className="switch-board__legend">
        <SwitchDial angle={0} size={34} />
        <p>
          <strong>Arrow = where the rounded inner end points.</strong> The flat handle sticks out of the ring on the opposite side.
        </p>
      </div>

      {practising && (
        <div className="switch-board__practice">
          <div className="switch-board__spin" role="group" aria-label="In-game turn direction">
            <span>Each click turns</span>
            <button type="button" aria-pressed={spin === 'cw'} onClick={() => { setSpin('cw'); resetClicks(); }}>⟳ Clockwise</button>
            <button type="button" aria-pressed={spin === 'ccw'} onClick={() => { setSpin('ccw'); resetClicks(); }}>⟲ Counter</button>
          </div>
          <p>
            Dials start untouched. Tap one to turn it a quarter. If these starting dials don&apos;t match the untouched dials in-game, switch the turn direction.
          </p>
          <div className="switch-board__progress" role="status">
            <strong>{setCount} / {switchStates.length}</strong> set
            <button type="button" className="switch-board__sound" aria-pressed={sound} onClick={() => setSound(!sound)}>
              {sound ? '🔊 Sound on' : '🔇 Sound off'}
            </button>
            <button type="button" onClick={resetClicks}>Reset</button>
          </div>
        </div>
      )}

      <ul className="switch-board__grid">
        {switchStates.map(({ item, angle, count, remaining, startDirection }) => {
          const done = remaining === 0;
          const body = (
            <>
              <SwitchDial angle={angle} size={46} className={practising && done ? 'is-set' : ''} />
              <span className="switch-card__copy">
                <strong>{item.shortLabel}</strong>
                {practising ? (
                  <span className={`switch-card__status${done ? ' is-set' : ''}`}>
                    {done ? `Set ${ARROW[item.direction]}` : `${remaining} more turn${remaining === 1 ? '' : 's'}`}
                  </span>
                ) : (
                  <span className="switch-card__dir">{item.arrow} {item.direction}</span>
                )}
                {practising ? (
                  <small>Starts {ARROW[startDirection]} · needs ×{item.turnsFromUntouched}</small>
                ) : (
                  showLocations && <small>{item.location}</small>
                )}
              </span>
            </>
          );

          return (
            <li key={item.id} className={`switch-card${practising && done ? ' is-set' : ''}`}>
              {practising ? (
                <button
                  type="button"
                  className="switch-card__button"
                  aria-label={`${item.shortLabel}: turned ${count} time${count === 1 ? '' : 's'}, ${done ? 'set' : `${remaining} more to go`}`}
                  onClick={() => turn(item, remaining)}
                >
                  {body}
                </button>
              ) : (
                <div className="switch-card__static">{body}</div>
              )}
            </li>
          );
        })}
        {extraSlot && <li className="switch-card switch-card--extra">{extraSlot}</li>}
      </ul>

      <p className="switch-board__note">{originsLightningSwitchVerification.note}</p>
    </section>
  );
}
