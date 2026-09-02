// src/pages/EasterEggs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import MapsHubHeader from '../components/MapsHubHeader';
import '../styles/pageStyles/AllMaps.css';

export default function EasterEggs() {
  return (
    <>
      <MapsHubHeader
        title="Easter Egg Maps"
        subtitle="All Easter Eggs BO1–BO3"
      />

      <div className="maps-wrapper">
        {['Black Ops 1', 'Black Ops 2', 'Black Ops 3'].map(game => {
          const section = mapData.filter(m => m.game === game && m.isEasterEgg);
          if (!section.length) return null;

          return (
            <section className="game-section" key={game}>
              <div className="game-header">
                <span className="game-title">{game}</span>
              </div>

              <div className="maps-grid">
                {section.map(map => (
                  <Link
                    key={map.slug}
                    to={`/easter-eggs/${map.slug}`}
                    style={{ display: 'contents' }}
                  >
                    <MapCard map={map} disableLink />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
