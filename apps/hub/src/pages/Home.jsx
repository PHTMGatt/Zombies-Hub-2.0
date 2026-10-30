import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward, IoMapOutline, IoSparklesOutline } from 'react-icons/io5';
import featuredMaps from '../data/featuredMaps';
import mapData from '../data/mapData';
import ContinueRuns from '../../../../shared/achievements/ContinueRuns';
import '../styles/pageStyles/Home.css';

export default function Home() {
  const [allMapsEntry, ...featuredRoutes] = featuredMaps;
  const easterEggCount = mapData.filter(map => map.isEasterEgg).length;
  const gameCount = new Set(mapData.map(map => map.game)).size;

  return (
    <section className="home">
      <div className="home-shell">
        <ContinueRuns />
        <section
          className="home-hero-panel"
          style={{ '--home-hero-image': `url(${allMapsEntry?.image})` }}
        >
          <div className="home-hero-overlay" />
          <div className="home-hero-copy">
            <span className="home-kicker">Zombies Hub 2.0</span>
            <h1 className="home-title">Every map. Every hunt. One hub.</h1>
            <p className="home-subtitle">
              A unified Call of Duty Zombies companion for map guides, Easter eggs,
              side quests, and the details you actually need mid-run.
            </p>

            <div className="home-actions">
              <Link to="/allmaps" className="home-cta home-cta-primary">
                <IoMapOutline aria-hidden="true" />
                Browse every map
                <IoArrowForward aria-hidden="true" />
              </Link>
              <Link to="/easter-eggs" className="home-cta home-cta-secondary">
                <IoSparklesOutline aria-hidden="true" />
                Main Easter eggs
              </Link>
            </div>
          </div>

          <div className="home-stats" aria-label="Zombies Hub coverage summary">
            <div>
              <strong>{mapData.length}</strong>
              <span>maps indexed</span>
            </div>
            <div>
              <strong>{easterEggCount}</strong>
              <span>main EE maps</span>
            </div>
            <div>
              <strong>{gameCount}</strong>
              <span>Black Ops eras</span>
            </div>
          </div>
        </section>

        <section className="home-featured" aria-labelledby="featured-routes-title">
          <div className="home-section-heading">
            <div>
              <span className="home-kicker">Featured routes</span>
              <h2 id="featured-routes-title">Pick your next run.</h2>
            </div>
            <Link to="/allmaps" className="home-text-link">
              Full map index <IoArrowForward aria-hidden="true" />
            </Link>
          </div>

          <div className="home-grid">
            {featuredRoutes.map(({ name, route, image }) => (
              <Link
                key={name}
                to={route}
                className="home-card"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="home-card-overlay" />
                <div className="home-card-content">
                  <span>Open guide</span>
                  <h3>{name}</h3>
                  <IoArrowForward aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-utility-strip" aria-label="Quick access">
          <div>
            <span className="home-kicker">Quick access</span>
            <h2>Know what you need?</h2>
          </div>
          <div className="home-utility-actions">
            <Link to="/side-easter-eggs">Side Easter eggs</Link>
            <Link to="/allmaps">Map index</Link>
            <Link to="/easter-eggs">Main quest guides</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
