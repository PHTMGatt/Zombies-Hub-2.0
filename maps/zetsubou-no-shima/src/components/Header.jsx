import React, { useState } from 'react';
import Nav from './Nav';
import '../styles/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="zets-header">
      <div className="zets-header-content">
        <h1 className="zets-header-title">Seeds of Doubt</h1>
        <p className="zets-header-subtitle">Zetsubou No Shima Easter Egg Guide</p>

        <button
          className="zets-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰ <span className="toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <Nav isOpen={menuOpen} />
    </header>
  );
};

export default Header;
