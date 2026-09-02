import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/NavBar.css';

const tabs = [
  { label: 'Home', path: '' },
  { label: 'Bows', path: 'bows' },
  { label: 'Parts', path: 'parts' },
  { label: 'Wisps', path: 'wisps' },
];
const BASE = '/maps/der-eisendrache';

const NavBar: React.FC = () => (
  <nav className="nav-bar" aria-label="Main navigation">
    {tabs.map(({ label, path }) => (
      <NavLink
        key={label}
        to={path ? `${BASE}/${path}` : BASE}
        end={!path}
        className={({ isActive }) =>
          `nav-bar__btn${isActive ? ' nav-bar__btn--active' : ''}`
        }
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default NavBar;
