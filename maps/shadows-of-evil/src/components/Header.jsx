import React from 'react';
import { NavLink } from 'react-router-dom';
import soeCover from '../../../../apps/hub/src/assets/images/Maps/Shadows_Of_Evil.jpg';
import '../styles/Shadows.css';

const BASE = '/maps/shadows-of-evil';

export default function Header() {
  return (
    <header className="soe-header">
      <img className="soe-header__image" src={soeCover} alt="Shadows of Evil" />
      <div className="soe-header__overlay" />
      <div className="soe-header__content">
        <div className="soe-header__identity">
          <span className="soe-header__kicker">Morg City</span>
          <h1>Shadows of Evil</h1>
          <p>Main Easter Egg Guide</p>
        </div>
        <nav aria-label="Shadows of Evil guide navigation">
          <NavLink to={BASE} end>Guide</NavLink>
        </nav>
      </div>
    </header>
  );
}
