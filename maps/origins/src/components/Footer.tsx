import React from "react";
import "../Styles/ComponentStyles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer origins-footer">
      <div className="origins-footer__backdrop" aria-hidden="true" />
      <div className="origins-footer__content">
        <div className="origins-footer__identity">
          <span className="origins-footer__kicker">Zombies Hub 2.0</span>
          <strong>Origins Guide</strong>
        </div>
        <div className="origins-footer__divider" aria-hidden="true" />
        <div className="origins-footer__meta">
          <span>Little Lost Girl</span>
          <span className="origins-footer__dot" aria-hidden="true">•</span>
          <span>Built for quick reference</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
