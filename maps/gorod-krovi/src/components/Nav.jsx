import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';

const BASE = '/maps/gorod-krovi';

const Nav = () => {
  return (
    <nav className="main-nav">
      <Link to={BASE}>Main Guide</Link>
      <Link to={`${BASE}/buildables`}>Buildables</Link>
      <Link to={`${BASE}/trophies`}>Trophy Challenges</Link>
      <Link to={`${BASE}/valves`}>Valve Solver</Link>
      <Link to={`${BASE}/boss`}>Boss Fight</Link>
    </nav>
  );
};

export default Nav;
