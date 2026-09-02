import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SideEEInfo() {
  const { mapKey } = useParams();
  return (
    <section className="hub-page">
      <h1>{mapKey}</h1>
      <p>The original side Easter egg guide is being migrated into this route.</p>
      <Link to="/side-easter-eggs">← Back to Side Easter Eggs</Link>
    </section>
  );
}
