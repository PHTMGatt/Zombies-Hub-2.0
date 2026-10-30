import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANGE_EVENT, PROGRESS_RESET_EVENT, activeRuns } from './achievements';
import './achievements.css';

/*
 * "Continue run" strip for the hub: one tap back to any run under way, at the step you left.
 * Renders nothing when no run is in progress.
 */
export default function ContinueRuns() {
  const [runs, setRuns] = useState(activeRuns);
  useEffect(() => {
    const refresh = () => setRuns(activeRuns());
    [CHANGE_EVENT, PROGRESS_RESET_EVENT, 'storage'].forEach((name) => window.addEventListener(name, refresh));
    return () => [CHANGE_EVENT, PROGRESS_RESET_EVENT, 'storage'].forEach((name) => window.removeEventListener(name, refresh));
  }, []);
  if (!runs.length) return null;
  return (
    <section className="zh-continue" aria-label="Runs in progress">
      {runs.slice(0, 3).map(({ mapId, map, step, total, done }) => (
        <Link key={mapId} to={map.route} className="zh-continue__run" style={{ '--ach-accent': map.accent }}>
          <span className="zh-continue__label">Continue run</span>
          <strong>{map.name}</strong>
          <span className="zh-continue__step">Step {step ?? done + 1} / {total}</span>
          <span className="zh-continue__go" aria-hidden="true">→</span>
        </Link>
      ))}
    </section>
  );
}
