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
        <NavLink to="/achievements" className={({ isActive }) => `hub-header__ach${isActive ? ' active' : ''}`} aria-label="Achievements" title="Achievements">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M7 2h10l-2 6.5H9z" fill="currentColor" opacity="0.55" />
            <circle cx="12" cy="15" r="7" fill="currentColor" />
            <path d="M12 11.2l1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.4z" fill="#071019" />
          </svg>
        </NavLink>
      </nav>
    </header>
  );
}
