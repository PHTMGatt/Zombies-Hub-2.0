import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MAPS, UNLOCK_EVENT, achievementById, soundEnabled } from './achievements';
import { playChime } from './chime';
import './achievements.css';

const SHOW_MS = 5200;

export function AchievementIcon({ accent, locked = false, size = 44 }) {
  return (
    <svg className={`zh-ach-icon${locked ? ' is-locked' : ''}`} style={{ '--ach-accent': accent }} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 4h20l-4 13H18z" className="zh-ach-icon__ribbon" />
      <circle cx="24" cy="29" r="15" className="zh-ach-icon__disc" />
      <circle cx="24" cy="29" r="11" className="zh-ach-icon__ring" />
      <path d="M24 21.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.6 5.2-.8z" className="zh-ach-icon__star" />
    </svg>
  );
}

/*
 * One small popup at a time, top corner, under the hub bar. It never takes focus or blocks input, leaves
 * after ~5 s, and pauses while hovered or focused. Extra unlocks wait in a queue.
 */
export default function AchievementToast() {
  const [queue, setQueue] = useState([]);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);
  const leavingRef = useRef(false);
  const current = queue[0];

  useEffect(() => {
    const onUnlock = (event) => {
      const achievement = achievementById(event.detail?.id);
      if (achievement) setQueue((items) => [...items, achievement]);
    };
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(UNLOCK_EVENT, onUnlock);
  }, []);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    clearTimeout(timer.current);
    setLeaving(true);
    timer.current = setTimeout(() => {
      leavingRef.current = false;
      setLeaving(false);
      setQueue((items) => items.slice(1));
    }, 260);
  }, []);

  // Hover / focus pause and resume the stay timer, but never touch the exit once it has started.
  const startTimer = useCallback(() => {
    if (leavingRef.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(dismiss, SHOW_MS);
  }, [dismiss]);

  const pause = () => {
    if (!leavingRef.current) clearTimeout(timer.current);
  };

  useEffect(() => {
    if (!current) return undefined;
    if (soundEnabled()) playChime();
    startTimer();
    return () => clearTimeout(timer.current);
  }, [current, startTimer]);

  const map = current ? MAPS[current.map] : null;

  return (
    <div className="zh-ach-toast-region" aria-live="polite" aria-atomic="true">
      {current && (
        <div
          key={current.id}
          className={`zh-ach-toast${leaving ? ' is-leaving' : ''}`}
          style={{ '--ach-accent': map.accent }}
          onMouseEnter={pause}
          onMouseLeave={startTimer}
          onFocus={pause}
          onBlur={startTimer}
        >
          <AchievementIcon accent={map.accent} />
          <div className="zh-ach-toast__text">
            <span className="zh-ach-toast__kicker">Achievement unlocked</span>
            <strong>{current.title}</strong>
            <span className="zh-ach-toast__map">{map.name}</span>
          </div>
          <Link className="zh-ach-toast__link" to="/achievements" onClick={dismiss}>View</Link>
          <button type="button" className="zh-ach-toast__close" aria-label="Dismiss" onClick={dismiss}>×</button>
        </div>
      )}
    </div>
  );
}
