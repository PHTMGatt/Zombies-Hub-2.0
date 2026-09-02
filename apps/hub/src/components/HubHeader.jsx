import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/hub-header.css';

export default function HubHeader() {
  return (
    <header className="hub-header">
      <NavLink to="/" className="hub-header__brand">Zombies Hub 2.0</NavLink>
      <nav className="hub-header__nav" aria-label="Zombies Hub navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/allmaps">Map List</NavLink>
        <NavLink to="/easter-eggs">EE Maps</NavLink>
        <NavLink to="/side-easter-eggs">Side EEs</NavLink>
      </nav>
    </header>
  );
}
