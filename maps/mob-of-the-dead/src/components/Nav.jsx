// src/components/Nav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => (
  <nav className="nav">
    <ul>
      <li><NavLink to="/" end>Overview</NavLink></li>
      <li><NavLink to="/free-blundergat">Blundergat</NavLink></li>
      <li><NavLink to="/spoon">Spoon</NavLink></li>
      <li><NavLink to="/redeemer">Redeemer</NavLink></li>
      <li><NavLink to="/logs">Logs</NavLink></li>
      <li><NavLink to="/final-step">Final Step</NavLink></li>
    </ul>
  </nav>
);

export default Nav;
