import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Nav.css';

const Nav = ({ isOpen }) => {
  return (
    <nav className={`zets-nav ${isOpen ? 'open' : ''}`}>
      <NavLink to="/" end>Overview</NavLink>
      <NavLink to="/prerequisites">Prerequisites</NavLink>
      <NavLink to="/reveal-blueprint">Reveal Blueprint</NavLink>
      <NavLink to="/cogs">Cogs</NavLink>
      <NavLink to="/elevator-battle">Boss Fight</NavLink>
      <NavLink to="/buildables">Buildables</NavLink>
    </nav>
  );
};

export default Nav;
