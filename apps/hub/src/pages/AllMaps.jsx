import React, { useMemo, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import MapFilter, { useMapFilter } from '../components/MapFilter';
import { applyFilter, filterCounts, MAP_FILTERS } from '../data/mapFilters';
import '../styles/pageStyles/AllMaps.css';

const games = ['Black Ops 1', 'Black Ops 2', 'Black Ops 3'];

const normalizeMap = map => ({
  ...map,
  slug: map.slug || map.name.toLowerCase().replace(/\s+/g, '-'),
  hasEasterEgg: Boolean(map.isEasterEgg),
});

export default function AllMaps() {
  const [query, setQuery] = useState('');
  const [show, setShow] = useMapFilter('allmaps');
  const normalizedMaps = useMemo(() => mapData.map(normalizeMap), []);

  // Search narrows first, so each Show count says how many cards that choice would leave.
  const searchedMaps = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return normalizedMaps;

    return normalizedMaps.filter(map =>
      [map.name, map.game, map.dlc]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(search))
    );
  }, [normalizedMaps, query]);
  const counts = useMemo(() => filterCounts('allmaps', searchedMaps), [searchedMaps]);
  const filteredMaps = useMemo(() => applyFilter('allmaps', show, searchedMaps), [searchedMaps, show]);
  const showLabel = MAP_FILTERS.allmaps.find(option => option.id === show)?.label;

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

        <MapFilter page="allmaps" value={show} onChange={setShow} counts={counts} />
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
            <strong>{query ? `No maps matched “${query}”` : 'No maps here'}{show !== 'all' ? ` in ${showLabel}` : ''}.</strong>
            <span>Try a map name, game title, or DLC name{show !== 'all' ? ', or show all maps' : ''}.</span>
            {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}
            {show !== 'all' && <button type="button" onClick={() => setShow('all')}>Show all maps</button>}
          </div>
        )}
      </div>
    </div>
  );
}
