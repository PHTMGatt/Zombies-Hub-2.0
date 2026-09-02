import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function MapInfo() {
  const { slug } = useParams();
  return (
    <section className="hub-page">
      <h1>{slug?.replaceAll('-', ' ')}</h1>
      <p>The original map information page is being imported from Zombies Hub.</p>
      <Link to="/allmaps">← Back to Map List</Link>
    </section>
  );
}
