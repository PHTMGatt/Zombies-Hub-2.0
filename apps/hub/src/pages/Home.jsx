// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import featuredMaps from '../data/featuredMaps';
import mapData from '../data/mapData';
import '../styles/pageStyles/Home.css';

export default function Home() {
  useEffect(() => {
    const allMaps = [
      ...featuredMaps,
      ...mapData.map((m) => ({
        slug: m.slug,
        renderLink: m.renderUrl || m.renderLink || null,
      })),
    ];

    allMaps.forEach(({ slug, renderLink }) => {
      if (slug && renderLink && renderLink.startsWith('http')) {
        fetch(renderLink, { mode: 'no-cors' }).catch(() => {});
      }
    });
  }, []);

  return (
    <section className="home">
      <h1 className="home-title">The Multiverse Is Fractured</h1>
      <p className="home-subtitle">Choose your entry point.</p>

      {/* prevent layout collapse with safe check */}
      {featuredMaps.length > 0 && (
        <div className="home-grid">
          {featuredMaps.map(({ name, slug, renderLink, image }) => {
            const to = slug ? `/maps/${slug}` : renderLink;
            const isFeatured = name === 'All Maps';

            return (
              <Link
                key={name}
                to={to}
                className={`card neon${isFeatured ? ' featured' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="overlay" />
                <div className="card-title">{name}</div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
