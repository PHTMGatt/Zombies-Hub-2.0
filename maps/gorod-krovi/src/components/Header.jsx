import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Header.css';
import banner from '../assets/GK_Banner.png';

const BASE = '/maps/gorod-krovi';

const Header = () => (
  <header className="gorod-header" style={{ backgroundImage: `url(${banner})` }}>
    <div className="gorod-header__overlay" />
    <div className="gorod-header__content">
      <div className="gorod-header__identity">
        <span className="gorod-header__kicker">Stalingrad · Zombies Hub 2.0</span>
        <h1 className="gorod-header__title">Gorod Krovi</h1>
        <p className="gorod-header__subtitle">Love and War</p>
      </div>

      <nav className="gorod-header__nav" aria-label="Gorod Krovi guide navigation">
        <NavLink end to={BASE} className="gorod-nav-link">Guide</NavLink>
        <NavLink to={`${BASE}/valves`} className="gorod-nav-link">Valve Solver</NavLink>
        <NavLink to={`${BASE}/trophies`} className="gorod-nav-link">Trophies</NavLink>
        <NavLink to={`${BASE}/buildables`} className="gorod-nav-link">Buildables</NavLink>
        <NavLink to={`${BASE}/boss`} className="gorod-nav-link">Boss Fight</NavLink>
      </nav>
    </div>
  </header>
);

export default Header;
