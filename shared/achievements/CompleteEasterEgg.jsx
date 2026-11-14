import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANGE_EVENT, getUnlocked, mainAchievementFor, unlockAchievement } from './achievements';
import './achievements.css';

/*
 * The one, quiet way to record a map's main Easter Egg: a text button after the last step. It records the
 * achievement and nothing else; no guide, step, mechanic or page ever depends on it.
 */
export default function CompleteEasterEgg({ mapId }) {
  const achievement = mainAchievementFor(mapId);
  const [earned, setEarned] = useState(() => Boolean(achievement && getUnlocked()[achievement.id]));
  const resultRef = useRef(null);
  const justEarned = useRef(false);

  // The button goes away once pressed: focus moves to the result ("Completed · View achievement") so it
  // is heard, and never drops to the page.
  useEffect(() => {
    if (!earned || !justEarned.current) return;
    justEarned.current = false;
    resultRef.current?.focus();
  }, [earned]);

  useEffect(() => {
    if (!achievement) return undefined;
    const refresh = () => setEarned(Boolean(getUnlocked()[achievement.id]));
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [achievement]);

  if (!achievement) return null;

  if (earned) {
    return (
      <p className="zh-complete zh-complete--earned" ref={resultRef} tabIndex={-1}>
        Completed · <Link to="/achievements">View achievement</Link>
      </p>
    );
  }

  const complete = () => {
    unlockAchievement(achievement.id);
    justEarned.current = true;
    setEarned(true);
  };

  return (
    <button type="button" className="zh-complete" onClick={complete}>
      I completed this Easter Egg
    </button>
  );
}
