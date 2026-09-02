// src/pages/MapDetails.jsx

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import MapsHubHeader from '../components/MapsHubHeader';
import mapData from '../data/mapData';
import imageData from '../data/imageData';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/MapDetails.css';

export default function MapDetails() {
  const { slug } = useParams();
  const map = mapData.find(m => m.slug === slug);

  // Redirect to All Maps if slug not found
  if (!map) {
    return <Navigate to="/allmaps" replace />;
  }

  // 1) External renderLink → header + iframe
  if (map.renderLink) {
    return (
      <>
        <MapsHubHeader title={map.name} subtitle={`${map.name} Guide`} />
        <div className="map-details-wrapper">
          <div className="map-details-header">
            <h2>{map.name}</h2>
            <a
              href={map.renderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="map-render-link"
            >
              Full Layout Render →
            </a>
          </div>
          <div className="iframe-container">
            <iframe
              src={map.renderLink}
              title={map.name}
              className="map-iframe"
              allowFullScreen
            />
          </div>
          <Link to="/allmaps" className="back-link">
            ← Back to Map List
          </Link>
        </div>
      </>
    );
  }

  // 2) Otherwise → full-page info card (no ComingSoon)
  return (
    <>
      <MapsHubHeader title={map.name} subtitle={`${map.name} Details`} />
      <div className="map-details-wrapper">
        <MapCard
          name={map.name}
          imageSrc={imageData[`${slug}Cover`]}
          description={map.description}
          dlc={map.dlc}
          released={map.released}
        />
        <Link to="/allmaps" className="back-link">
          ← Back to Map List
        </Link>
      </div>
    </>
  );
}
