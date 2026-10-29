import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';

const BASE = '/maps/revelations';

const SECTIONS = [
  { to: BASE, label: 'Main Guide', end: true },
  { to: `${BASE}/apothicon-upgrade`, label: 'Apothicon Upgrade' },
  { to: `${BASE}/egg-locations`, label: 'Egg Locations' },
  { to: `${BASE}/summoning-key`, label: 'Summoning Key' },
  { to: `${BASE}/sound-step`, label: 'Sound Step' },
];

function Header() {
  const { pathname } = useLocation();
  const tabsRef = useRef(null);

  // On phones the section tabs are a swipeable row; keep the current section centered (row only, never the page).
  useEffect(() => {
    const row = tabsRef.current;
    const active = row?.querySelector('.rev-nav-link.active');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    row.scrollLeft += activeBox.left - rowBox.left - (rowBox.width - activeBox.width) / 2;
  }, [pathname]);

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
        <div className="rev-header__tabs" ref={tabsRef}>
          {SECTIONS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className="rev-nav-link">{label}</NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
