import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';

const Nav = () => {
  return (
    <nav className="main-nav">
      <Link to="/">Main Guide</Link>
      <Link to="/buildables">Buildables</Link>
      <Link to="/trophies">Trophy Challenges</Link>
      <Link to="/valves">Valve Solver</Link>
      <Link to="/boss">Boss Fight</Link>
    </nav>
  );
};

export default Nav;
