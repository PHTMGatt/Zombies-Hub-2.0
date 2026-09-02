import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="rev-footer">
      <div className="rev-footer__content">
        <div className="rev-footer__identity">
          <span className="rev-footer__kicker">Zombies Hub 2.0</span>
          <strong>Revelations</strong>
        </div>
        <div className="rev-footer__divider" aria-hidden="true" />
        <div className="rev-footer__meta">
          <span>For The Good Of All</span>
          <span aria-hidden="true">•</span>
          <span>The House</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
