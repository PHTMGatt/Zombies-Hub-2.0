import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Nav.css';

const BASE = '/maps/zetsubou-no-shima';

const Nav = ({ isOpen }) => {
  return (
    <nav className={`zets-nav ${isOpen ? 'open' : ''}`}>
      <NavLink to={BASE} end>Overview</NavLink>
      <NavLink to={`${BASE}/prerequisites`}>Prerequisites</NavLink>
      <NavLink to={`${BASE}/reveal-blueprint`}>Reveal Blueprint</NavLink>
      <NavLink to={`${BASE}/cogs`}>Cogs</NavLink>
      <NavLink to={`${BASE}/elevator-battle`}>Boss Fight</NavLink>
      <NavLink to={`${BASE}/buildables`}>Buildables</NavLink>
    </nav>
  );
};

export default Nav;
