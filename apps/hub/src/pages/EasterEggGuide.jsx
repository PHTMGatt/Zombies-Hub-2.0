// src/pages/EasterEggGuide.jsx
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import MapsHubHeader from '../components/MapsHubHeader';
import mapData from '../data/mapData';
import guides from '../data/EasterEggGuides';
import ComingSoon from './ComingSoon';
import '../styles/pageStyles/MapDetails.css';
import '../styles/compStyles/EggGuideCard.css';

export default function EasterEggGuide() {
  const { slug } = useParams();

  // 1) External renderLink (double‐header + iframe)
  const map = mapData.find(m => m.slug === slug);
  if (map?.renderLink) {
    return (
      <>
        <MapsHubHeader title={map.name} subtitle={`${map.name} Guide`} />
        <div className="map-details-wrapper">
          <div className="map-details-header">
            <h2>{map.name}</h2>
          </div>
          <div className="iframe-container">
            <iframe
              src={map.renderLink}
              title={map.name}
              className="map-iframe"
              allowFullScreen
            />
          </div>
        </div>
      </>
    );
  }

  // 2) Video guide (egg‐card layout)
  const guide = guides.find(g => g.slug === slug);
  if (guide) {
    // helper to pull embeddable YouTube URL
    const extractEmbedUrl = url => {
      const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };
    const embedUrl = guide.videoUrl ? extractEmbedUrl(guide.videoUrl) : null;

    if (embedUrl) {
      return (
        <>
          <MapsHubHeader title={guide.title} subtitle={`${guide.title} Guide`} />
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
        </>
      );
    }
  }

  // 3) Fallback: no map.renderLink and no valid video
  return <ComingSoon />;
}
