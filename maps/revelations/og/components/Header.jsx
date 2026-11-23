import React from 'react';
import { NavLink as Link } from 'react-router-dom'; // hub: NavLink so the current tab carries aria-current
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">Revelations Easter Egg Guide</h1>
        <p className="header-subtitle">For The Good Of All — and A Better Tomorrow</p>
      </div>

      <nav className="header-nav" aria-label="Revelations guide navigation">
        <Link to="/maps/revelations" end className="nav-link">Main Guide</Link>
        <Link to="/maps/revelations/apothicon-upgrade" className="nav-link">Apothicon Upgrade</Link>
        <Link to="/maps/revelations/egg-locations" className="nav-link">Egg Locations</Link>
        <Link to="/maps/revelations/summoning-key" className="nav-link">Summoning Key</Link>
        <Link to="/maps/revelations/sound-step" className="nav-link">Sound Step</Link>
      </nav>
    </header>
  );
}

export default Header;
