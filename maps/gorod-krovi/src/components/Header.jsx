import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Header.css';
import banner from '../assets/GK_Banner.png';

const BASE = '/maps/gorod-krovi';

const Header = () => (
  <header className="header-container" style={{ backgroundImage: `url(${banner})` }}>
    <div className="header-overlay" />
    <div className="header-content">
      <div className="header-left">
        <h1 className="header-title">Gorod Krovi Easter Egg Guide</h1>
        <p className="header-subtitle">Decode SOPHIA’s mission through the fires of Stalingrad.</p>
      </div>
      <nav className="header-nav">
        <NavLink end to={BASE} className="nav-link">Main Guide</NavLink>
        <NavLink to={`${BASE}/buildables`} className="nav-link">Buildables</NavLink>
        <NavLink to={`${BASE}/trophies`} className="nav-link">Trophy Challenges</NavLink>
        <NavLink to={`${BASE}/valves`} className="nav-link">Valve Solver</NavLink>
        <NavLink to={`${BASE}/boss`} className="nav-link">Boss Fight</NavLink>
      </nav>
    </div>
  </header>
);

export default Header;
