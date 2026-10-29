// src/pages/SideEasterEggList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import imageData from '../data/imageData';
import originsArtwork from '../assets/images/Featured/Origins.webp';
import gorodArtwork from '../assets/images/Featured/GK.jpg';
import derEisendracheArtwork from '../assets/images/Featured/DE.webp';
import '../styles/SideEE/SideEasterEggList.css';

const MAPS = [
  { key: 'origins-speedrun', label: 'Origins Speed Run', cover: originsArtwork },
  { key: 'kino', label: 'Kino der Toten', cover: imageData.Kino_Der_TotenLayout },
  { key: 'gk', label: 'Gorod Krovi', cover: gorodArtwork },
  { key: 'de', label: 'Der Eisendrache', cover: derEisendracheArtwork },
  { key: 'soe', label: 'Shadows of Evil', cover: imageData.Shadows_Of_EvilLayout },
];

export default function SideEasterEggList() {
  return (
    <div className="ee-page-wrapper side-ee-list-page">
      <header className="side-ee-list-heading">
        <span>OPTIONAL + ADVANCED</span>
        <h1>Side Easter Eggs</h1>
        <p>Quick references, music eggs, and advanced routes that stay separate from the main quest flow.</p>
      </header>

      <section className="side-ee-grid">
        {MAPS.map(({ key, label, cover }) => (
          <Link
            key={key}
            to={`/side-easter-eggs/${key}`}
            className="side-ee-card"
          >
            <div
              className="side-ee-card__header"
              style={{ backgroundImage: `url(${cover || ''})` }}
            />
            <div className="side-ee-card__title">{label}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
