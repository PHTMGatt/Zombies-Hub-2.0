// src/components/Header.jsx
import React from 'react';
import Nav from './Nav';
import bannerSrc from '../assets/images/mob-banner.png';
import '../styles/Header.css';

const Header = () => (
  <header className="header">
    <img
      src={bannerSrc}
      alt="Mob of the Dead banner"
      className="header-bg"
    />

    <div className="header-content">
      <h1>
        Mob of the Dead<br />
        <small>Pop Goes the Weasel</small>
      </h1>
      <Nav /> {/* Note: Nav lives here now, removed from App.jsx */}
    </div>
  </header>
);

export default Header;
