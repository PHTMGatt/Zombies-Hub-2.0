import React from "react";
import "../Styles/ComponentStyles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer origins-footer">
      <div className="origins-footer__backdrop" aria-hidden="true" />
      <div className="origins-footer__content">
        <strong>Origins</strong>
        <span aria-hidden="true">•</span>
        <span>Little Lost Girl</span>
      </div>
    </footer>
  );
};

export default Footer;
