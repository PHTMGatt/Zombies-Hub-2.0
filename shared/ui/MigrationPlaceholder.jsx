import React from 'react';

export default function MigrationPlaceholder({ title, children }) {
  return (
    <section className="map-module">
      <div className="map-module__placeholder">
        <h1>{title}</h1>
        <p>{children || 'This guide has been staged for integration into Zombies Hub 2.0.'}</p>
      </div>
    </section>
  );
}
