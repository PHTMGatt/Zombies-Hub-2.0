import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Tabs.css';

const BASE = '/maps/shadows-of-evil';

// Shadows of Evil has one guide page plus its Step details tab.
export default function Tabs() {
  return (
    <nav className="soe-tabs" aria-label="Shadows of Evil guide navigation">
      <NavLink to={BASE} end>Main guide</NavLink>
      <NavLink to={`${BASE}/step-details`}>Step details</NavLink>
    </nav>
  );
}
