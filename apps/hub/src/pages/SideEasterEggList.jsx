// src/pages/SideEasterEggList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import sideEEArtwork from '../data/sideEEArtwork';
import '../styles/SideEE/SideEasterEggList.css';

const MAPS = [
  { key: 'origins-speedrun', label: 'Origins Speed Run', detail: 'BO3 speedrun route', to: '/maps/origins/speed-run' },
  { key: 'kino', label: 'Kino der Toten', detail: 'Film reels + hidden radios' },
  { key: 'gk', label: 'Gorod Krovi', detail: 'Side Easter Egg video guide' },
  { key: 'de', label: 'Der Eisendrache', detail: 'Side Easter Egg video guide' },
  { key: 'soe', label: 'Shadows of Evil', detail: 'Side Easter Egg video guide' },
].map((entry) => ({ ...entry, cover: sideEEArtwork[entry.key].src, focus: sideEEArtwork[entry.key].focus }));

export default function SideEasterEggList() {
  return (
    <div className="ee-page-wrapper side-ee-list-page">
      <header className="side-ee-list-heading">
        <span>OPTIONAL + ADVANCED</span>
        <h1>Side Easter Eggs</h1>
        <p>Quick references, music eggs, and advanced routes that stay separate from the main quest flow.</p>
      </header>

      <section className="side-ee-grid">
        {MAPS.map(({ key, label, detail, focus, cover, to }) => (
          <Link
            key={key}
            to={to ?? `/side-easter-eggs/${key}`}
            className="side-ee-card"
          >
            <div className="side-ee-card__media">
              <img
                className="side-ee-card__art"
                src={cover}
                alt=""
                width="1280"
                height="720"
                decoding="async"
                style={{ objectPosition: focus }}
              />
            </div>
            <div className="side-ee-card__body">
              <span className="side-ee-card__title">{label}</span>
              <span className="side-ee-card__detail">{detail}</span>
            </div>
            <span className="side-ee-card__cue" aria-hidden="true">→</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
