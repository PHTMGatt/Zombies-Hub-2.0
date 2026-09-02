import React from 'react';
import { Link } from 'react-router-dom';
import featuredMaps from '../data/featuredMaps';
import '../styles/pageStyles/Home.css';

export default function Home() {
  return (
    <section className="home">
      <h1 className="home-title">The Multiverse Is Fractured</h1>
      <p className="home-subtitle">Choose your entry point.</p>

      <div className="home-grid">
        {featuredMaps.map(({ name, to, image, featured }) => (
          <Link
            key={name}
            to={to}
            className={`card neon${featured ? ' featured' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="overlay" />
            <div className="card-title">{name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
