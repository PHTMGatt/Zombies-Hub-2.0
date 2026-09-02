import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="zets-footer">
      <div className="zets-footer__backdrop" aria-hidden="true" />
      <div className="zets-footer__content">
        <div className="zets-footer__identity">
          <span className="zets-footer__kicker">Zombies Hub 2.0</span>
          <strong>Zetsubou No Shima</strong>
        </div>
        <div className="zets-footer__divider" aria-hidden="true" />
        <div className="zets-footer__meta">
          <span>Seeds of Doubt</span>
          <span className="zets-footer__dot" aria-hidden="true">•</span>
          <span>Pohnpei</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
