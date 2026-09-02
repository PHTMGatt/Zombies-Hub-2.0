import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import guides from '../data/EasterEggGuides';
import ComingSoon from './ComingSoon';
import '../styles/compStyles/EggGuideCard.css';

const dedicatedGuides = new Set([
  'origins',
  'mob-of-the-dead',
  'shadows-of-evil',
  'der-eisendrache',
  'zetsubou-no-shima',
  'gorod-krovi',
  'revelations',
]);

export default function EasterEggGuide() {
  const { slug } = useParams();

  if (dedicatedGuides.has(slug)) {
    return <Navigate to={`/maps/${slug}`} replace />;
  }

  const guide = guides.find(g => g.slug === slug);
  if (!guide) {
    return <ComingSoon />;
  }

  const match = guide.videoUrl?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : null;

  if (!embedUrl) {
    return <ComingSoon />;
  }

  return (
    <div className="egg-card guide-page">
      <div className="egg-card__media">
        <iframe
          src={embedUrl}
          title={guide.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          width="100%"
          height="400"
          style={{ borderRadius: '8px' }}
        />
      </div>
      <div className="egg-card__body">
        <h1>{guide.title}</h1>
        <div className="egg-card__meta">
          <span><strong>Game:</strong> {guide.game}</span>
          <span><strong>DLC:</strong> {guide.dlc}</span>
          <span><strong>Released:</strong> {guide.released}</span>
        </div>
        <p>{guide.description}</p>
        <Link to="/easter-eggs" className="egg-card__link">
          ← Back to Easter Egg Maps
        </Link>
      </div>
    </div>
  );
}
