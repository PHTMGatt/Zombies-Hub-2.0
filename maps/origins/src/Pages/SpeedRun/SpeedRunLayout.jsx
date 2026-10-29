import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import originsSpeedRun, { originsSpeedRunVideo } from '../../../../../shared/data/originsSpeedRun';
import { useGuideProgress } from '../../../../../shared/guide/useGuideProgress';
import originsGuide from '../../data/originsGuide';
import { SpeedrunLocked } from '../../components/SpeedrunGate';
import { useSpeedrunUnlock } from '../../components/speedrunUnlock';
import '../../Styles/PageStyles/SpeedRun.css';

const BASE = '/maps/origins/speed-run';

const SECTIONS = [
  { to: BASE, label: 'Route', detail: '8 checkpoints', end: true },
  { to: `${BASE}/prep`, label: 'Prep & Rules', detail: 'Before you start' },
  { to: `${BASE}/lightning`, label: 'Lightning Switches', detail: 'Dials + skips' },
];

export default function SpeedRunLayout() {
  const { unlocked } = useSpeedrunUnlock();
  const progress = useGuideProgress('origins', originsGuide);

  // Speedrun is a reward for finishing the Easter Egg (or knowing the chords).
  if (!unlocked) {
    return (
      <div className="speedrun-page">
        <div className="speedrun-shell">
          <SpeedrunLocked completed={progress.completed} total={progress.total} compact />
        </div>
      </div>
    );
  }

  return (
    <div className="speedrun-page">
      <div className="speedrun-shell">
        <header className="speedrun-head">
          <div>
            <span className="speedrun-kicker">Black Ops III · Advanced Route</span>
            <h2>Origins Speed Run</h2>
            <p>{originsSpeedRun.intro}</p>
          </div>
          <a className="speedrun-watch" href={originsSpeedRunVideo.url} target="_blank" rel="noreferrer">
            Watch full route <span aria-hidden="true">↗</span>
          </a>
        </header>

        <nav className="speedrun-tabs" aria-label="Speed run sections">
          {SECTIONS.map(({ to, label, detail, end }) => (
            <NavLink key={to} to={to} end={end} className="speedrun-tab">
              <strong>{label}</strong>
              <small>{detail}</small>
            </NavLink>
          ))}
        </nav>

        <Outlet />

        <div className="speedrun-foot">
          <Link to="/side-easter-eggs">← Back to Side Easter Eggs</Link>
          <a href={originsSpeedRunVideo.url} target="_blank" rel="noreferrer">Full speedrun video ↗</a>
        </div>
      </div>
    </div>
  );
}
