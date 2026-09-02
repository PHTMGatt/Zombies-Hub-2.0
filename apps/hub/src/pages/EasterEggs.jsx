import React from 'react';
import { Link } from 'react-router-dom';

export default function EasterEggs() {
  return (
    <section className="hub-page">
      <h1>Main Easter Eggs</h1>
      <p>The original Easter egg catalog is being migrated into this Hub route.</p>
      <p><Link to="/allmaps">Browse maps</Link></p>
    </section>
  );
}
