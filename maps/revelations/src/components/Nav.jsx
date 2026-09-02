import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-link">Main Guide</Link>
      <Link to="/apothicon-upgrade" className="nav-link">Apothicon Upgrade</Link>
      <Link to="/egg-locations" className="nav-link">Egg Locations</Link>
      <Link to="/summoning-key" className="nav-link">Summoning Key</Link>
      <Link to="/sound-step" className="nav-link">Sound Step</Link>
    </nav>
  );
}

export default Nav;
