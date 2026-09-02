import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE = '/maps/mob-of-the-dead';

const Nav = () => (
  <nav className="nav" aria-label="Mob of the Dead guide navigation">
    <ul>
      <li><NavLink to={BASE} end>Guide</NavLink></li>
      <li><NavLink to={`${BASE}/plane`}>Plane</NavLink></li>
      <li><NavLink to={`${BASE}/retriever-skulls`}>Retriever + Skulls</NavLink></li>
      <li><NavLink to={`${BASE}/codes`}>Codes</NavLink></li>
      <li><NavLink to={`${BASE}/final-step`}>Final Fight</NavLink></li>
    </ul>
  </nav>
);

export default Nav;
