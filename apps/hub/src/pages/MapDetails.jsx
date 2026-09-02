import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import mapData from '../data/mapData';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/MapDetails.css';

export default function MapDetails() {
  const { slug } = useParams();
  const dedicatedRoute = getDedicatedGuideRoute(slug);

  if (dedicatedRoute) {
    return <Navigate to={dedicatedRoute} replace />;
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
