import React, { useMemo, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/AllMaps.css';

const games = ['Black Ops 1', 'Black Ops 2', 'Black Ops 3'];

const normalizeMap = map => ({
  ...map,
  slug: map.slug || map.name.toLowerCase().replace(/\s+/g, '-'),
  hasEasterEgg: Boolean(map.isEasterEgg),
});

export default function AllMaps() {
  const [query, setQuery] = useState('');
  const normalizedMaps = useMemo(() => mapData.map(normalizeMap), []);

  const filteredMaps = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return normalizedMaps;

    return normalizedMaps.filter(map =>
      [map.name, map.game, map.dlc]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(search))
    );
  }, [normalizedMaps, query]);

  return (
    <div className="maps-wrapper">
      <header className="maps-hero">
        <span className="maps-kicker">Map archive</span>
        <h1 className="page-title">All Zombies Maps</h1>
        <p className="page-subtitle">
          Browse the Black Ops 1–3 map catalog, DLC releases, and Easter Egg coverage.
        </p>

        <label className="map-search" htmlFor="map-search-input">
          <IoSearchOutline aria-hidden="true" />
          <input
            id="map-search-input"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search maps, games, or DLC..."
            autoComplete="off"
          />
          <span>{filteredMaps.length} maps</span>
        </label>
      </header>

      <div className="maps-content" aria-live="polite">
        {games.map(game => {
          const section = filteredMaps.filter(map => map.game === game);
          if (!section.length) return null;

          return (
            <section className="game-section" key={game}>
              <div className="game-header">
                <div>
                  <span className="game-title">{game}</span>
                  <span className="game-count">{section.length} maps</span>
                </div>
              </div>

              <div className="maps-grid">
                {section.map(map => (
                  <MapCard key={`${map.game}-${map.slug}`} map={map} />
                ))}
              </div>
            </section>
          );
        })}

        {filteredMaps.length === 0 && (
          <div className="maps-empty-state">
            <strong>No maps matched “{query}”.</strong>
            <span>Try a map name, game title, or DLC name.</span>
            <button type="button" onClick={() => setQuery('')}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
