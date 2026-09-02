import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/NavBar.css';

const tabs = [
  { label: 'Main Quest', short: 'Quest', path: '' },
  { label: 'Bows', short: 'Bows', path: 'bows' },
  { label: 'Wisps', short: 'Wisps', path: 'wisps' },
  { label: 'Gear', short: 'Gear', path: 'parts' },
  { label: 'Boss', short: 'Boss', path: 'boss' },
];

const BASE = '/maps/der-eisendrache';

const NavBar: React.FC = () => (
  <nav className="de-nav" aria-label="Der Eisendrache guide navigation">
    {tabs.map(({ label, short, path }) => (
      <NavLink
        key={label}
        to={path ? `${BASE}/${path}` : BASE}
        end={!path}
        className={({ isActive }) => `de-nav__link${isActive ? ' is-active' : ''}`}
      >
        <span className="de-nav__full">{label}</span>
        <span className="de-nav__short">{short}</span>
      </NavLink>
    ))}
  </nav>
);

export default NavBar;
