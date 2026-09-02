import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import mapData from '../data/mapData';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/MapDetails.css';

const dedicatedGuides = new Set([
  'origins',
  'mob-of-the-dead',
  'der-eisendrache',
  'zetsubou-no-shima',
  'gorod-krovi',
  'revelations',
]);

export default function MapDetails() {
  const { slug } = useParams();

  if (dedicatedGuides.has(slug)) {
    return <Navigate to={`/maps/${slug}`} replace />;
  }

  const map = mapData.find(m => m.slug === slug);
  if (!map) {
    return <Navigate to="/allmaps" replace />;
  }

  return (
    <div className="map-details-wrapper">
      <div className="map-details-header">
        <h2>{map.name}</h2>
      </div>

      <MapCard map={map} isPreview={false} disableLink />

      <Link to="/allmaps" className="back-link">
        ← Back to Map List
      </Link>
    </div>
  );
}
