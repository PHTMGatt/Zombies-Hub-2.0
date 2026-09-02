import React from 'react';
import { Link } from 'react-router-dom';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/AllMaps.css';

export default function EasterEggs() {
  return (
    <div className="maps-wrapper">
      <h1 className="page-title">Easter Egg Maps</h1>
      <p className="page-subtitle">All Easter Eggs BO1–BO3</p>

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
                  key={`${game}-${map.slug}`}
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
  );
}
