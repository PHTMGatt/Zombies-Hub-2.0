// File: Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/compStyles/NavBar.css';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Site logo/title */}
      <h1 className="navbar-title">Zombies Hub</h1>

      {/* Internal site navigation */}
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/allmaps" className={({ isActive }) => (isActive ? 'active' : '')}>
          Map List
        </NavLink>
        <NavLink to="/easter-eggs" className={({ isActive }) => (isActive ? 'active' : '')}>
          EE Maps
        </NavLink>
        <a
          href="https://one2-react-portfolio.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact
        </a>
      </div>

      {/* Theme toggle switch (dark/light) */}
      <div className="toggle-wrapper">
        <ThemeToggle />
      </div>
    </nav>
  );
}
