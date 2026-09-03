import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import guides from '../data/EasterEggGuides';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import ComingSoon from './ComingSoon';
import '../styles/compStyles/EggGuideCard.css';

export default function EasterEggGuide() {
  const { slug } = useParams();
  const dedicatedRoute = getDedicatedGuideRoute(slug);

  if (dedicatedRoute) {
    return <Navigate to={dedicatedRoute} replace />;
  }

  const guide = guides.find(g => g.slug === slug);
  if (!guide) {
    return <ComingSoon />;
  }

  const match = guide.videoUrl?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;

  if (!embedUrl) {
    return <ComingSoon />;
  }

  return (
    <main className="egg-card guide-page">
      <header className="egg-guide__header">
        <span>VIDEO GUIDE</span>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </header>

      <div className="egg-guide__layout">
        <div className="egg-card__media egg-guide__video">
          <iframe
            src={embedUrl}
            title={`${guide.title} Easter Egg guide`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <aside className="egg-guide__sidebar">
          <div className="egg-guide__meta-row">
            <span>Game</span>
            <strong>{guide.game}</strong>
          </div>
          <div className="egg-guide__meta-row">
            <span>DLC</span>
            <strong>{guide.dlc}</strong>
          </div>
          <div className="egg-guide__meta-row">
            <span>Released</span>
            <strong>{guide.released}</strong>
          </div>

          <Link to="/easter-eggs" className="egg-card__link">
            ← Easter Egg Maps
          </Link>
        </aside>
      </div>
    </main>
  );
}
