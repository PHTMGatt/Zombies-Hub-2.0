import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/ComponentStyles/SpeedrunGate.css';

const ROUTES = [
  { to: '/maps/origins/speed-run', label: 'Route', detail: '8 checkpoints with timestamps' },
  { to: '/maps/origins/speed-run/prep', label: 'Prep & Rules', detail: 'Loadout, snow, robots, resets' },
  { to: '/maps/origins/speed-run/lightning', label: 'Lightning Switches', detail: 'Interactive dials + hildaless' },
];

export function SpeedrunLocked({ completed, total, compact = false }) {
  return (
    <div className={`speedrun-gate is-locked${compact ? ' is-compact' : ''}`} role="status">
      <span className="speedrun-gate__icon" aria-hidden="true">🔒</span>
      <div>
        <span className="speedrun-gate__kicker">Speedrun mode · locked</span>
        <h3>??? — Complete the circuit</h3>
        <p>
          Finish every step of Little Lost Girl in the tracker
          {Number.isFinite(completed) && <> (<strong>{completed} / {total}</strong> done)</>} to unlock Speedrun.
        </p>
        <p className="speedrun-gate__hint">⚡ Or… somewhere among the Lightning Staff notes, a panel still hums.</p>
        {compact && (
          <div className="speedrun-gate__back">
            <Link to="/maps/origins">Back to the Origins guide →</Link>
            <Link to="/side-easter-eggs">← Back to Side Easter Eggs</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpeedrunUnlocked() {
  return (
    <div className="speedrun-gate is-unlocked">
      <span className="speedrun-gate__icon" aria-hidden="true">⏱</span>
      <div>
        <span className="speedrun-gate__kicker">Speedrun mode · unlocked</span>
        <h3>Origins Speed Run</h3>
        <p>Routing, robot and snow timing, staff dupes and skips — its own guide, separate from the Easter Egg steps.</p>
        <div className="speedrun-gate__links">
          {ROUTES.map((route) => (
            <Link key={route.to} to={route.to}>
              <strong>{route.label} →</strong>
              <small>{route.detail}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
