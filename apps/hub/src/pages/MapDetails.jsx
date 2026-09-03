import React from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import mapData from '../data/mapData';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/MapDetails.css';

export default function MapDetails() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const requestedGame = searchParams.get('game');
  const dedicatedRoute = getDedicatedGuideRoute(slug);

  if (dedicatedRoute) {
    return <Navigate to={dedicatedRoute} replace />;
  }

  const variants = mapData.filter(m => m.slug === slug);
  const map = variants.find(m => m.game === requestedGame) || variants[0];

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
