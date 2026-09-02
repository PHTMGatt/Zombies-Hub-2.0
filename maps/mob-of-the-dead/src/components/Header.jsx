import React from 'react';
import Nav from './Nav';
import bannerSrc from '../assets/images/mob-banner.png';
import '../styles/Header.css';

const Header = () => (
  <header className="mob-header">
    <img src={bannerSrc} alt="" aria-hidden="true" className="header-bg" />

    <div className="header-content">
      <div className="mob-header__identity">
        <h1>Mob of the Dead</h1>
        <small>Pop Goes the Weasel</small>
      </div>
      <Nav />
    </div>
  </header>
);

export default Header;
