// File: MapsHubHeader.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import featuredMaps from '../data/featuredMaps';
import '../styles/compStyles/MapsHubHeader.css';

export default function MapsHubHeader() {
  return (
    <header className="maps-hub-header">
      <h1 className="maps-hub-title">Zombies Hub</h1>

      <nav className="maps-hub-nav">
        {/* Featured maps with slugs only */}
        {featuredMaps
          .filter(m => m.slug)
          .map(m => (
            <NavLink
              key={m.slug}
              to={`/maps/${m.slug}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {m.name}
            </NavLink>
          ))}

        {/* Always-available full map list link */}
        <NavLink to="/allmaps">All Maps</NavLink>
      </nav>
    </header>
  );
}
