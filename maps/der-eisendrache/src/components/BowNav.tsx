import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/BowNav.css';

const bows = [
  { path: '', label: 'Overview', accent: 'overview' },
  { path: 'base', label: 'Base', accent: 'base' },
  { path: 'electric', label: 'Storm', accent: 'electric' },
  { path: 'fire', label: 'Fire', accent: 'fire' },
  { path: 'wolf', label: 'Wolf', accent: 'wolf' },
  { path: 'void', label: 'Void', accent: 'void' },
];

const BASE = '/maps/der-eisendrache/bows';

const BowNav: React.FC = () => (
  <nav className="de-bow-nav" aria-label="Der Eisendrache bow selection">
    <span className="de-bow-nav__label">Bow Path</span>
    <div className="de-bow-nav__links">
      {bows.map(({ path, label, accent }) => (
        <NavLink
          key={label}
          to={path ? `${BASE}/${path}` : BASE}
          end={!path}
          className={({ isActive }) => `de-bow-nav__link de-bow-nav__link--${accent}${isActive ? ' is-active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BowNav;
