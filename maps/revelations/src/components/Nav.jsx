import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const BASE = '/maps/revelations';

function Nav() {
  return (
    <nav className="nav">
      <Link to={BASE} className="nav-link">Main Guide</Link>
      <Link to={`${BASE}/apothicon-upgrade`} className="nav-link">Apothicon Upgrade</Link>
      <Link to={`${BASE}/egg-locations`} className="nav-link">Egg Locations</Link>
      <Link to={`${BASE}/summoning-key`} className="nav-link">Summoning Key</Link>
      <Link to={`${BASE}/sound-step`} className="nav-link">Sound Step</Link>
    </nav>
  );
}

export default Nav;
