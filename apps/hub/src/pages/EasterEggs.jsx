import React from 'react';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/AllMaps.css';

const games = ['Black Ops 1', 'Black Ops 2', 'Black Ops 3'];

export default function EasterEggs() {
  const easterEggMaps = mapData.filter(map => map.isEasterEgg);

  return (
    <div className="maps-wrapper">
      <header className="maps-hero">
        <span className="maps-kicker">Main quests</span>
        <h1 className="page-title">Easter Egg Maps</h1>
        <p className="page-subtitle">
          Jump straight into main quest coverage across Black Ops 1–3.
        </p>
        <div className="maps-summary-pill">{easterEggMaps.length} quest-enabled maps</div>
      </header>

      <div className="maps-content">
        {games.map(game => {
          const section = easterEggMaps.filter(map => map.game === game);
          if (!section.length) return null;

          return (
            <section className="game-section" key={game}>
              <div className="game-header">
                <div>
                  <span className="game-title">{game}</span>
                  <span className="game-count">{section.length} quests</span>
                </div>
              </div>

              <div className="maps-grid">
                {section.map(map => (
                  <MapCard
                    key={`${game}-${map.slug}`}
                    map={{ ...map, hasEasterEgg: true }}
                    to={`/easter-eggs/${map.slug}`}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
