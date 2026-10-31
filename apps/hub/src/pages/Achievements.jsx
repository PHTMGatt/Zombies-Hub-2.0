import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ACHIEVEMENTS,
  CHANGE_EVENT,
  MAPS,
  clearOldGuideData,
  getUnlocked,
  resetAchievements,
  setSoundEnabled,
  soundEnabled,
} from '../../../../shared/achievements/achievements';
import { AchievementIcon } from '../../../../shared/achievements/AchievementToast';
import { playChime } from '../../../../shared/achievements/chime';
import '../styles/pageStyles/Achievements.css';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null);

const snapshot = () => ({
  unlocked: getUnlocked(),
  sound: soundEnabled(),
});

/*
 * The completion cabinet: one medal per map's main Easter Egg (earned with "I completed this Easter Egg"
 * at the end of its guide), then hidden extras once earned. Settings and clear options sit below.
 */
export default function Achievements() {
  const [state, setState] = useState(snapshot);

  useEffect(() => {
    const refresh = () => setState(snapshot());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const mains = ACHIEVEMENTS.filter((item) => item.kind === 'main-ee');
  const extras = ACHIEVEMENTS.filter((item) => item.kind !== 'main-ee');
  const earnedMains = mains.filter((item) => state.unlocked[item.id]).length;
  const earnedExtras = extras.filter((item) => state.unlocked[item.id]);
  const hiddenLeft = extras.filter((item) => item.hidden && !state.unlocked[item.id]).length;

  const toggleSound = () => {
    const next = !state.sound;
    setSoundEnabled(next);
    if (next) playChime();
  };

  const confirmClearOld = () => {
    if (window.confirm('Clear data left by the old step tracker and guide modes? Achievements and saved notes (character picks, symbols, safe codes) stay.')) clearOldGuideData();
  };

  const confirmResetAchievements = () => {
    if (window.confirm('Erase every earned achievement and its date? Saved notes stay. This cannot be undone.')) resetAchievements();
  };

  return (
    <div className="ach-page">
      <header className="ach-head">
        <h1>Achievements</h1>
        <p className="ach-head__count" aria-label={`${earnedMains} of ${mains.length} main Easter Eggs complete`}>
          <strong>{earnedMains}</strong> / {mains.length} <span>main Easter Eggs</span>
        </p>
      </header>

      <ul className="ach-shelf">
        {mains.map((item) => {
          const map = MAPS[item.map];
          const earned = state.unlocked[item.id];
          const status = earned ? (formatDate(earned.at) ?? 'Complete') : 'Not yet';
          return (
            <li key={item.id} className={`ach-medal${earned ? ' is-earned' : ''}`} style={{ '--ach-accent': map.accent }}>
              <Link to={map.route} className="ach-medal__link">
                <AchievementIcon accent={map.accent} locked={!earned} size={56} />
                <span className="ach-medal__title">{item.title}</span>
                <span className="ach-medal__map">{map.name}</span>
                <span className="ach-medal__status">
                  <span className="visually-hidden">{earned ? 'Unlocked: ' : 'Locked: '}</span>
                  {status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {(earnedExtras.length > 0 || hiddenLeft > 0) && (
        <section className="ach-extras" aria-label="Secret achievements">
          <h2>Secrets</h2>
          <ul>
            {earnedExtras.map((item) => (
              <li key={item.id} style={{ '--ach-accent': MAPS[item.map].accent }}>
                <AchievementIcon accent={MAPS[item.map].accent} size={32} />
                <span><strong>{item.title}</strong> {MAPS[item.map].name}</span>
                {formatDate(state.unlocked[item.id].at) && <small>{formatDate(state.unlocked[item.id].at)}</small>}
              </li>
            ))}
            {hiddenLeft > 0 && (
              <li className="is-hidden">
                <AchievementIcon locked size={32} />
                <span><strong>???</strong> {hiddenLeft} hidden</span>
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="ach-settings" aria-label="Settings">
        <button type="button" className="ach-toggle" role="switch" aria-checked={state.sound} onClick={toggleSound}>
          <span className="ach-toggle__track" aria-hidden="true"><span /></span>
          Unlock sound
        </button>

        <details className="ach-danger">
          <summary>Reset options</summary>
          <div>
            <button type="button" onClick={confirmClearOld}>Clear old guide data</button>
            <p>Removes data left by the old step tracker and guide modes. Achievements and saved notes stay.</p>
            <button type="button" onClick={confirmResetAchievements}>Reset achievements</button>
            <p>Erases earned achievements and dates. Saved notes stay.</p>
          </div>
        </details>
      </section>
    </div>
  );
}
