import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="gorod-footer">
    <div className="gorod-footer__glow" aria-hidden="true" />
    <div className="gorod-footer__content">
      <div className="gorod-footer__identity">
        <span className="gorod-footer__kicker">Zombies Hub 2.0</span>
        <strong>Gorod Krovi</strong>
      </div>
      <div className="gorod-footer__divider" aria-hidden="true" />
      <div className="gorod-footer__meta">
        <span>Love and War</span>
        <span className="gorod-footer__dot" aria-hidden="true">•</span>
        <span>Stalingrad</span>
      </div>
    </div>
  </footer>
);

export default Footer;
