import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav className="nav">
      <Link to="/maps/revelations" className="nav-link">Main Guide</Link>
      <Link to="/maps/revelations/apothicon-upgrade" className="nav-link">Apothicon Upgrade</Link>
      <Link to="/maps/revelations/egg-locations" className="nav-link">Egg Locations</Link>
      <Link to="/maps/revelations/summoning-key" className="nav-link">Summoning Key</Link>
      <Link to="/maps/revelations/sound-step" className="nav-link">Sound Step</Link>
    </nav>
  );
}

export default Nav;
