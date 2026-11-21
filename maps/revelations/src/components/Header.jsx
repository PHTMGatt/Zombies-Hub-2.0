import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const BASE = '/maps/revelations';

// Owner spec 2026-11-21 (mockup A): the OG Revelations tabs only. Every tab is a main-EE step reference.
const SECTIONS = [
  { to: BASE, label: 'Main Guide', end: true },
  { to: `${BASE}/apothicon-upgrade`, label: 'Apothicon Upgrade' },
  { to: `${BASE}/egg-locations`, label: 'Egg Locations' },
  { to: `${BASE}/summoning-key`, label: 'Summoning Key' },
  { to: `${BASE}/sound-step`, label: 'Sound Step' },
];

function Header() {
  return (
    <header className="rev-header">
      <div className="rev-header__left">
        <h1 className="rev-header__title">
          <span className="rev-header__map">Revelations</span>{' '}
          <span className="rev-header__kind">Easter Egg Guide</span>
        </h1>
        <p className="rev-header__subtitle">For The Good Of All — and A Better Tomorrow</p>
      </div>

      <nav className="rev-header__nav" aria-label="Revelations guide navigation">
        <div className="rev-header__tabs">
          {SECTIONS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className="rev-nav-link">{label}</NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
