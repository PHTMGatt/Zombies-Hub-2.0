import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer: React.FC = () => (
  <footer className="de-footer">
    <div className="de-footer__art" aria-hidden="true" />
    <div className="de-footer__content">
      <div>
        <span>Der Eisendrache</span>
        <strong>My Brother’s Keeper</strong>
      </div>
      <nav aria-label="Der Eisendrache footer navigation">
        <Link to="/maps/der-eisendrache">Main Quest</Link>
        <Link to="/maps/der-eisendrache/bows">Bows</Link>
        <Link to="/maps/der-eisendrache/boss">Boss</Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
