import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="mob-footer">
    <div className="mob-footer__content">
      <div className="mob-footer__identity">
        <span className="mob-footer__kicker">Zombies Hub 2.0</span>
        <strong>Mob of the Dead</strong>
      </div>
      <div className="mob-footer__divider" aria-hidden="true" />
      <div className="mob-footer__meta">
        <span>Pop Goes the Weasel</span>
        <span aria-hidden="true">•</span>
        <span>Alcatraz</span>
      </div>
    </div>
  </footer>
);

export default Footer;
