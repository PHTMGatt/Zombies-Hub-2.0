// src/pages/AllMaps.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import mapData from '../data/mapData';
import mapInfo from '../data/mapInfo';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/AllMaps.css';

export default function AllMaps() {
  return (
    <div className="maps-wrapper">
      <h1 className="page-title">All Zombies Maps</h1>
      <p className="page-subtitle">
        Full list from BO1 – BO3 with DLC & Easter Egg status
      </p>

      {['Black Ops 1', 'Black Ops 2', 'Black Ops 3'].map(game => {
        const section = mapData
          .filter(m => m.game === game)
          .map(m => {
            const slug = m.slug || m.name.toLowerCase().replace(/\s+/g, '-');
            return {
              ...m,
              slug,
              hasEasterEgg: mapInfo[slug]?.hasEasterEgg || false,
            };
          });

        return (
          <section className="game-section" key={game}>
            <div className="game-header">
              <span className="game-title">{game}</span>
            </div>

            <div className="maps-grid">
              {section.map(m => (
                <Link
                  key={m.slug}
                  to={`/maps/${m.slug}`}
                  style={{ display: 'contents' }}
                >
                  <MapCard map={m} />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
);
}
