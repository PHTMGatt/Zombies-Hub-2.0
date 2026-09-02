import React from 'react';
import soeCover from '../../../../apps/hub/src/assets/images/Maps/Shadows_Of_Evil.jpg';
import '../styles/Shadows.css';

export default function Header() {
  return (
    <header className="soe-header">
      <img className="soe-header__image" src={soeCover} alt="" aria-hidden="true" />
      <div className="soe-header__overlay" />
      <div className="soe-header__content">
        <div className="soe-header__identity">
          <h1>Shadows of Evil</h1>
          <p>Main Easter Egg</p>
        </div>
      </div>
    </header>
  );
}
