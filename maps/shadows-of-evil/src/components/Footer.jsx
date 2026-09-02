import React from 'react';
import soeCover from '../../../../apps/hub/src/assets/images/Maps/Shadows_Of_Evil.jpg';
import '../styles/Shadows.css';

export default function Footer() {
  return (
    <footer className="soe-footer">
      <img className="soe-footer__image" src={soeCover} alt="" aria-hidden="true" />
      <div className="soe-footer__overlay" />
      <div className="soe-footer__content">
        <span>Zombies Hub 2.0</span>
        <strong>Shadows of Evil</strong>
        <span>Morg City · Main Easter Egg</span>
      </div>
    </footer>
  );
}
