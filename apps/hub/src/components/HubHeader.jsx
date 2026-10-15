import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/hub-header.css';

const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function HubHeader() {
  return (
    <header className="hub-header">
      <NavLink to="/" className="hub-header__brand" aria-label="Zombies Hub 2.0 home">
        <span className="hub-header__mark" aria-hidden="true">ZH</span>
        <span className="hub-header__brand-copy">
          <strong>Zombies Hub</strong>
          <small>2.0</small>
        </span>
      </NavLink>

      <nav className="hub-header__nav" aria-label="Zombies Hub navigation">
        <NavLink to="/" end className={navClass}>Home</NavLink>
        <NavLink to="/allmaps" className={navClass}>Maps</NavLink>
        <NavLink to="/easter-eggs" className={navClass}>Main EEs</NavLink>
        <NavLink to="/side-easter-eggs" className={navClass}>Side EEs</NavLink>
      </nav>
    </header>
  );
}
