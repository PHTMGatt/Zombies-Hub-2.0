import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">Revelations Easter Egg Guide</h1>
        <p className="header-subtitle">For The Good Of All — and A Better Tomorrow</p>
      </div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">Main Guide</Link>
        <Link to="/apothicon-upgrade" className="nav-link">Apothicon Upgrade</Link>
        <Link to="/egg-locations" className="nav-link">Egg Locations</Link>
        <Link to="/summoning-key" className="nav-link">Summoning Key</Link>
        <Link to="/sound-step" className="nav-link">Sound Step</Link>
      </nav>
    </header>
  );
}

export default Header;
