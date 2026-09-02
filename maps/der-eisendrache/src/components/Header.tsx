// 'Header.tsx'
// -------------

import React from 'react';
import NavBar from './NavBar';
import '../styles/components/Header.css';

const Header: React.FC = () => (
  <header className="header-site">
    <div className="header-site__bg" />
    <div className="header-site__content">
      <h1 className="header-site__title">Der Eisendrache EE Guide</h1>
      <NavBar />
    </div>
  </header>
);

export default Header;
