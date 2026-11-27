import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BASE = '/maps/mob-of-the-dead';

const Nav = () => {
  const { pathname } = useLocation();
  const rowRef = useRef(null);

  // The tabs are a swipeable row on phones; keep the current page's tab in view (row only, never the page).
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector('a.active');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    row.scrollLeft += activeBox.left - rowBox.left - (rowBox.width - activeBox.width) / 2;
  }, [pathname]);

  return (
    <nav className="nav" aria-label="Mob of the Dead guide navigation">
      <ul ref={rowRef}>
        <li><NavLink to={BASE} end>Guide</NavLink></li>
        <li><NavLink to={`${BASE}/plane`}>Plane</NavLink></li>
        <li><NavLink to={`${BASE}/retriever-skulls`}>Retriever + Skulls</NavLink></li>
        <li><NavLink to={`${BASE}/codes`}>Codes</NavLink></li>
        <li><NavLink to={`${BASE}/final-step`}>Final Fight</NavLink></li>
        <li><NavLink to={`${BASE}/step-details`}>Step details</NavLink></li>
      </ul>
    </nav>
  );
};

export default Nav;
