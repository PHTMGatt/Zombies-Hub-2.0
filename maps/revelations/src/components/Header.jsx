import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const BASE = '/maps/revelations';

function Header() {
  return (
    <header className="rev-header">
      <div className="rev-header__left">
        <h1 className="rev-header__title">Revelations Easter Egg Guide</h1>
        <p className="rev-header__subtitle">For The Good Of All — and A Better Tomorrow</p>
      </div>

      <nav className="rev-header__nav" aria-label="Revelations guide navigation">
        <NavLink to={BASE} end className="rev-nav-link">Main Guide</NavLink>
        <NavLink to={`${BASE}/apothicon-upgrade`} className="rev-nav-link">Apothicon Upgrade</NavLink>
        <NavLink to={`${BASE}/egg-locations`} className="rev-nav-link">Egg Locations</NavLink>
        <NavLink to={`${BASE}/summoning-key`} className="rev-nav-link">Summoning Key</NavLink>
        <NavLink to={`${BASE}/sound-step`} className="rev-nav-link">Sound Step</NavLink>
      </nav>
    </header>
  );
}

export default Header;
