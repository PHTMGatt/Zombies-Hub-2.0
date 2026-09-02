// src/pages/MapInfo.jsx
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import MapsHubHeader from '../components/MapsHubHeader';
import mapInfo from '../data/mapInfo';
import mapData from '../data/mapData';
import '../styles/pageStyles/MapInfo.css';

export default function MapInfo() {
  const { slug } = useParams();
  const info = mapInfo[slug];

  const meta = mapData.find((m) => m.name === info.name) || {};

  const banner = meta.coverImage || meta.layoutImage;
  
  // console.log('MapInfo meta for', slug, ':', meta);
  // console.log('Available slugs:', mapData.map(m => m.slug));
  //  console.log('Looking for slug:', slug);


  return (
    <>
      <MapsHubHeader
        title={`${info.name} Easter Egg`}
        subtitle="Easter Egg Guide"
      />

      <div className="map-info-container">
        <div className={`map-info-card${!info.description ? ' no-info' : ''}`}>
          {banner && (
            <div className="map-info-banner-container">
              <img
                src={banner}
                alt={`${info.name} map banner`}
                className="map-info-banner"
              />
              <div className="map-info-banner-overlay">
                {info.name}
              </div>
            </div>
          )}

          <div className="map-info-details">
            <div className="info-row">
              {meta.game && (
                <span><strong>Game:</strong> {meta.game}</span>
              )}
              {meta.dlc && (
                <span><strong>DLC:</strong> {meta.dlc}</span>
              )}
            </div>

            <div className="info-row">
              {info.releasedIn && (
                <span><strong>Released:</strong> {info.releasedIn}</span>
              )}
              {info.hasEasterEgg ? (
                <Link to="/easter-eggs" className="badge">
                  🎁 Easter-Egg Inside
                </Link>
              ) : (
                <span className="badge no-egg">No Easter-Egg</span>
              )}
            </div>

            {info.description && (
              <p className="description">{info.description}</p>
            )}

            <Link to="/allMaps" className="back-link">
              ← Back to Map list
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
