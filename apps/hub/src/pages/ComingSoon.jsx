// src/pages/ComingSoon.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pageStyles/ComingSoon.css';

// Simple fallback screen when a guide or feature isn’t ready
export default function ComingSoon() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__card">
        <h1>Coming Soon</h1>
        <p>We’re working on this guide. Check back soon!</p>
        <Link to="/easter-eggs" className="coming-soon__link">
          ← Back to Easter Egg Maps
        </Link>
      </div>
    </div>
  );
}