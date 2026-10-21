import React from 'react';
import Nav from './Nav';
import bannerSrc from '../assets/images/mob-banner.png';
import '../styles/Header.css';

const Header = () => (
  <header className="mob-header zh-map-header">
    <img src={bannerSrc} alt="" aria-hidden="true" className="header-bg" />

    <div className="header-content zh-map-header__inner">
      <div className="mob-header__identity zh-map-header__id">
        <h1>Mob of the Dead</h1>
        <small>Pop Goes the Weasel</small>
      </div>
      <Nav />
    </div>
  </header>
);

export default Header;
