// 'NavBar.tsx'
// -------------

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/NavBar.css';

const tabs = ['Home', 'Bows', 'Parts', 'Wisps'];

const NavBar: React.FC = () => (
  <nav className="nav-bar" aria-label="Main navigation">
    {tabs.map(label => {
      const path = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
      return (
        <NavLink
          key={label}
          to={path}
          className={({ isActive }) =>
            `nav-bar__btn${isActive ? ' nav-bar__btn--active' : ''}`
          }
        >
          {label}
        </NavLink>
      );
    })}
  </nav>
);

export default NavBar;
