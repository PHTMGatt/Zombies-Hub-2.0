import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SwitchDial, { DIRECTION_ANGLE } from './SwitchDial';
import OriginsMap from './OriginsMap';
import { playSet, playTurn } from './switchSounds';
import { useSpeedrunUnlock } from './speedrunUnlock';
import {
  originsLightningSwitchRoute,
  originsLightningSwitchVerification,
} from '../../../../shared/data/originsLightning';
import '../Styles/ComponentStyles/SwitchBoard.css';

const ARROW = { Right: '→', Down: '↓', Left: '←', Up: '↑' };
const DIRECTIONS = ['Right', 'Down', 'Left', 'Up'];
const directionAt = (angle) => DIRECTIONS[(((angle / 90) % 4) + 4) % 4];
const remainingTurns = (item, count) => (((item.turnsFromUntouched - count) % 4) + 4) % 4;

/*
 * The seven Lightning Staff switches: ONE compact panel (replaces the old Switch Positions cards and the
 * Electrical Panel).
 * - Final positions: the solved state at a glance, with each switch's location.
 * - Practice turns: each dial starts at its untouched position (from the stored turn count and the chosen
 *   in-game turn direction); every tap turns it a quarter. All seven set earns the hidden
 *   "Electrical Panel Solved" achievement. Nothing is locked behind it.
 */
export default function LightningSwitchBoard({ extraSlot = null, showLocations = false, id }) {
  const { unlocked, unlock } = useSpeedrunUnlock();
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
    return { item, angle, count, remaining: remainingTurns(item, count), startDirection: directionAt(start) };
  });
  const setCount = switchStates.filter((state) => state.remaining === 0).length;
  const allSet = practising && setCount === switchStates.length;

  const turn = (item, remaining) => {
    const next = { ...clicks, [item.id]: (clicks[item.id] ?? 0) + 1 };
    setClicks(next);
    const solved = originsLightningSwitchRoute.every((route) => remainingTurns(route, next[route.id] ?? 0) === 0);
    if (solved) {
      if (!unlocked) unlock();
      if (sound) playSet();
    } else if (sound) {
      if (remaining === 1) playSet();
      else playTurn();
    }
  };

  return (
    <section id={id} className={`switch-board${practising ? ' is-practice' : ''}`} aria-label="Lightning Staff switches">
      <div className="switch-board__head">
        <h3>Switch Positions</h3>
        <div className="switch-board__modes" role="group" aria-label="Switch view">
          <button type="button" aria-pressed={!practising} onClick={() => setMode('final')}>Final positions</button>
          <button type="button" aria-pressed={practising} onClick={() => { resetClicks(); setMode('practice'); }}>Practice turns</button>
        </div>
      </div>

      {practising ? (
        <div className="switch-board__practice">
          <p className="switch-board__help">Dials start untouched. Tap one to turn it a quarter. If these starting dials don&apos;t match the untouched dials in-game, switch the turn direction.</p>
          <div className="switch-board__controls">
            <span>Each tap turns</span>
            <button type="button" aria-pressed={spin === 'cw'} onClick={() => { setSpin('cw'); resetClicks(); }}>Clockwise</button>
            <button type="button" aria-pressed={spin === 'ccw'} onClick={() => { setSpin('ccw'); resetClicks(); }}>Counter</button>
            <button type="button" aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? 'Sound on' : 'Sound off'}</button>
            <button type="button" onClick={resetClicks}>Reset</button>
          </div>
          <p className="switch-board__count" role="status">
            <strong>{setCount} / {switchStates.length}</strong> set
            {allSet && <> · Electrical Panel solved. <Link to="/maps/origins/speed-run">Open Speed Run →</Link></>}
          </p>
        </div>
      ) : (
        <p className="switch-board__help"><strong>Arrow = where the rounded inner end points.</strong> The flat handle sticks out of the ring on the opposite side.</p>
      )}

      <OriginsMap
        className="switch-board__map"
        title="Lightning Staff switches"
        switches={switchStates.map(({ item, angle, count, remaining }) => ({
          id: item.id,
          label: item.shortLabel,
          angle,
          done: practising && remaining === 0,
          onTurn: practising ? () => turn(item, remaining) : undefined,
          ariaLabel: `${item.shortLabel}: turned ${count} time${count === 1 ? '' : 's'}, ${remaining === 0 ? 'set' : `${remaining} more to go`}`,
        }))}
      />
      <p className="switch-board__note">Switch spots on the sketch are estimated from where each one is in-game.</p>

      <ul className="switch-board__grid">
        {switchStates.map(({ item, angle, count, remaining, startDirection }) => {
          const done = remaining === 0;
          const body = (
            <>
              <SwitchDial angle={angle} size={44} className={practising && done ? 'is-set' : ''} />
              <span className="switch-card__copy">
                <strong>{item.shortLabel}</strong>
                {practising ? (
                  <>
                    <span className={`switch-card__status${done ? ' is-set' : ''}`}>
                      {done ? `Set ${ARROW[item.direction]}` : `${remaining} more turn${remaining === 1 ? '' : 's'}`}
                    </span>
                    <small>Starts {ARROW[startDirection]} · needs ×{item.turnsFromUntouched}</small>
                  </>
                ) : (
                  <>
                    <span className="switch-card__dir">{item.arrow} {item.direction}</span>
                    {showLocations && <small>{item.location}</small>}
                  </>
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
      </ul>

      {extraSlot && <div className="switch-board__extra">{extraSlot}</div>}
      <p className="switch-board__note">{originsLightningSwitchVerification.note}</p>
    </section>
  );
}
