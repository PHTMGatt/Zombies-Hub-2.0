import React, { useMemo } from 'react';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import MapFilter, { useMapFilter } from '../components/MapFilter';
import { mainEggStatus, hasVideo } from '../data/guideStatus';
import { applyFilter, filterCounts } from '../data/mapFilters';
import '../styles/pageStyles/AllMaps.css';

const games = ['Black Ops 1', 'Black Ops 2', 'Black Ops 3'];

export default function EasterEggs() {
  const allQuests = useMemo(() => mapData.filter(map => map.isEasterEgg), []);
  const [show, setShow] = useMapFilter('easter-eggs');
  const counts = useMemo(() => filterCounts('easter-eggs', allQuests, { hasVideo }), [allQuests]);
  const easterEggMaps = useMemo(() => applyFilter('easter-eggs', show, allQuests, { hasVideo }), [allQuests, show]);

  return (
    <div className="maps-wrapper">
      <header className="maps-hero">
        <span className="maps-kicker">Main quests</span>
        <h1 className="page-title">Easter Egg Maps</h1>
        <p className="page-subtitle">
          Full guides walk every step; the rest link to a video or the map’s info.
        </p>
        <div className="maps-summary-pill">{allQuests.length} quest-enabled maps</div>
        <MapFilter page="easter-eggs" value={show} onChange={setShow} counts={counts} />
      </header>

      <div className="maps-content" aria-live="polite">
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
                {section.map(map => {
                  const status = mainEggStatus(map);
                  return (
                    <MapCard
                      key={`${game}-${map.slug}`}
                      map={{ ...map, hasEasterEgg: true }}
                      to={status.to}
                      badge={status.badge}
                      badgeKind={status.kind}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
