import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE = '/maps/mob-of-the-dead';

const Nav = () => (
  <nav className="nav">
    <ul>
      <li><NavLink to={BASE} end>Overview</NavLink></li>
      <li><NavLink to={`${BASE}/free-blundergat`}>Blundergat</NavLink></li>
      <li><NavLink to={`${BASE}/spoon`}>Spoon</NavLink></li>
      <li><NavLink to={`${BASE}/redeemer`}>Redeemer</NavLink></li>
      <li><NavLink to={`${BASE}/logs`}>Logs</NavLink></li>
      <li><NavLink to={`${BASE}/final-step`}>Final Step</NavLink></li>
    </ul>
  </nav>
);

export default Nav;
