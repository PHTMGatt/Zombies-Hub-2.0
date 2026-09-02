import React from 'react';
import '../styles/components/Footer.css';

const Footer: React.FC = () => (
  <footer className="de-footer">
    <div className="de-footer__art" aria-hidden="true" />
    <div className="de-footer__content">
      <strong>Der Eisendrache</strong>
      <span aria-hidden="true">•</span>
      <span>My Brother’s Keeper</span>
    </div>
  </footer>
);

export default Footer;
