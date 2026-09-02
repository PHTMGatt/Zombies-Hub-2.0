import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import mapInfo from '../data/mapInfo';
import mapData from '../data/mapData';
import '../styles/pageStyles/MapInfo.css';

export default function MapInfo() {
  const { slug } = useParams();
  const info = mapInfo[slug];

  if (!info) {
    return <Navigate to="/allmaps" replace />;
  }

  const meta = mapData.find(m => m.slug === slug) || mapData.find(m => m.name === info.name) || {};
  const banner = meta.coverImage || meta.layoutImage;

  return (
    <div className="map-info-container">
      <div className={`map-info-card${!info.description ? ' no-info' : ''}`}>
        {banner && (
          <div className="map-info-banner-container">
            <img
              src={banner}
              alt={`${info.name} map banner`}
              className="map-info-banner"
            />
            <div className="map-info-banner-overlay">{info.name}</div>
          </div>
        )}

        <div className="map-info-details">
          <div className="info-row">
            {meta.game && <span><strong>Game:</strong> {meta.game}</span>}
            {meta.dlc && <span><strong>DLC:</strong> {meta.dlc}</span>}
          </div>

          <div className="info-row">
            {info.releasedIn && <span><strong>Released:</strong> {info.releasedIn}</span>}
            {info.hasEasterEgg ? (
              <Link to={`/easter-eggs/${slug}`} className="badge">
                🎁 Easter-Egg Inside
              </Link>
            ) : (
              <span className="badge no-egg">No Easter-Egg</span>
            )}
          </div>

          {info.description && <p className="description">{info.description}</p>}

          <Link to="/allmaps" className="back-link">
            ← Back to Map list
          </Link>
        </div>
      </div>
    </div>
  );
}
