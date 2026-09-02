// src/pages/SideEasterEggList.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import imageData from '../data/imageData';
import '../styles/SideEE/SideEasterEggList.css';

// Side Easter Egg maps data
const MAPS = [
  { key: 'kino', label: 'Kino der Toten',     cover: imageData.Kino_Der_TotenCover },
  { key: 'gk',   label: 'Gorod Krovi',        cover: imageData.Gorod_KroviCover },
  { key: 'de',   label: 'Der Eisendrache',    cover: imageData.Der_EisendracheCover },
  { key: 'soe',  label: 'Shadows of Evil',    cover: imageData.Shadows_Of_EvilCover },
];

export default function SideEasterEggList() {
  return (
    <div className="ee-page-wrapper">
      <section className="side-ee-grid">
        {MAPS.map(({ key, label, cover }) => (
          <Link
            key={key}
            to={`/side-easter-eggs/${key}`}
            className="side-ee-card"
          >
            {/* Card Header Background */}
            <div
              className="side-ee-card__header"
              style={{
                backgroundImage: `url(${cover || ''})`,
              }}
            />
            
            {/* Card Title */}
            <div className="side-ee-card__title">{label}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
