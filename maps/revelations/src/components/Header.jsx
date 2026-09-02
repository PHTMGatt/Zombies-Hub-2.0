import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const BASE = '/maps/revelations';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">Revelations Easter Egg Guide</h1>
        <p className="header-subtitle">For The Good Of All — and A Better Tomorrow</p>
      </div>

      <nav className="header-nav">
        <NavLink to={BASE} end className="nav-link">Main Guide</NavLink>
        <NavLink to={`${BASE}/apothicon-upgrade`} className="nav-link">Apothicon Upgrade</NavLink>
        <NavLink to={`${BASE}/egg-locations`} className="nav-link">Egg Locations</NavLink>
        <NavLink to={`${BASE}/summoning-key`} className="nav-link">Summoning Key</NavLink>
        <NavLink to={`${BASE}/sound-step`} className="nav-link">Sound Step</NavLink>
      </nav>
    </header>
  );
}

export default Header;
