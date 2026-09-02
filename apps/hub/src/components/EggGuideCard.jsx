// src/components/EggGuideCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/compStyles/EggGuideCard.css';

export default function EggGuideCard({
  slug,
  title,
  game,
  dlc,
  released,
  description,
  videoUrl,
}) {
  // Extract YouTube ID
  const extractYouTubeID = url => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  const videoId = extractYouTubeID(videoUrl);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <Link to={`/maps/${slug}`} className="egg-card">
      <div className="egg-card__media">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`Preview for ${title}`}
            className="egg-card__thumbnail"
          />
        ) : (
          <div className="egg-card__placeholder">No preview available</div>
        )}
      </div>
      <div className="egg-card__body">
        <h2>{title}</h2>
        <div className="egg-card__meta">
          <span><strong>Game:</strong> {game}</span>
          <span><strong>DLC:</strong> {dlc}</span>
          <span><strong>Released:</strong> {released}</span>
        </div>
        <p>{description}</p>
        <span className="egg-card__link">Watch Full Walkthrough →</span>
      </div>
    </Link>
  );
}
