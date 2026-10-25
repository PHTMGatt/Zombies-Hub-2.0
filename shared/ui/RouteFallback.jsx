import React from 'react';

// Shown while a dedicated map module's chunk loads. Uses the map-module box so
// the page keeps its height and the Hub footer doesn't jump up and back down.
export default function RouteFallback() {
  return <section className="map-module" aria-busy="true" aria-label="Loading guide" />;
}
