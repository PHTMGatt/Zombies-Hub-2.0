import React, { useEffect, useState } from 'react';
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
      <p className="zh-complete zh-complete--earned">
        Completed · <Link to="/achievements">View achievement</Link>
      </p>
    );
  }

  return (
    <button type="button" className="zh-complete" onClick={() => { unlockAchievement(achievement.id); setEarned(true); }}>
      I completed this Easter Egg
    </button>
  );
}
