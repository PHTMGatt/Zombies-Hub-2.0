import React from 'react';
import Nav from './Nav';
import bannerSrc from '../assets/images/mob-banner.png';
import '../styles/Header.css';

const Header = () => (
  <header className="mob-header">
    <img
      src={bannerSrc}
      alt="Mob of the Dead banner"
      className="header-bg"
    />

    <div className="header-content">
      <span className="mob-header__kicker">Alcatraz · Zombies Hub 2.0</span>
      <h1>
        Mob of the Dead
        <small>Pop Goes the Weasel</small>
      </h1>
      <Nav />
    </div>
  </header>
);

export default Header;
