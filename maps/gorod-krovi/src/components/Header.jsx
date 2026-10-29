import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import banner from '../assets/GK_Banner.png';

const BASE = '/maps/gorod-krovi';

const Header = () => {
  const { pathname } = useLocation();
  const navRef = useRef(null);

  // On phones the pills are a swipeable row; keep the current page's pill in view (row only, never the page).
  useEffect(() => {
    const row = navRef.current;
    const active = row?.querySelector('.gorod-nav-link.active');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    row.scrollLeft += activeBox.left - rowBox.left - (rowBox.width - activeBox.width) / 2;
  }, [pathname]);

  return (
    <header className="gorod-header" style={{ backgroundImage: `url(${banner})` }}>
      <div className="gorod-header__overlay" />
      <div className="gorod-header__content">
        <div className="gorod-header__identity">
          <h1 className="gorod-header__title">Gorod Krovi</h1>
          <p className="gorod-header__subtitle">Love and War</p>
        </div>

        <nav className="gorod-header__nav" ref={navRef} aria-label="Gorod Krovi guide navigation">
          <NavLink end to={BASE} className="gorod-nav-link">Guide</NavLink>
          <NavLink to={`${BASE}/valves`} className="gorod-nav-link">Valve Solver</NavLink>
          <NavLink to={`${BASE}/trophies`} className="gorod-nav-link">Trophies</NavLink>
          <NavLink to={`${BASE}/buildables`} className="gorod-nav-link">Buildables</NavLink>
          <NavLink to={`${BASE}/boss`} className="gorod-nav-link">Boss Fight</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
