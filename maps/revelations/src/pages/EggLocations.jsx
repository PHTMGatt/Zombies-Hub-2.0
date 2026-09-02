import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import eggData from '../data/eggData';
import '../styles/EggLocations.css';

const EggLocations = () => {
  const videoRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(eggData[0]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const playSegment = (start, end) => {
    videoRef.current?.playSegment(start, end);
  };

  const handleSelectCard = (section) => {
    setCurrentCard(section);
    setSelectedLocation(null);
    playSegment(section.sectionStart, section.sectionEnd);
  };

  const handleLocation = (location) => {
    setSelectedLocation(location.name);
    playSegment(location.start, location.end);
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Location Reference</span>
          <h1 className="sk-title">Egg Locations</h1>
          <p className="rev-page-intro">
            Choose a map area first, then jump straight to the exact spawn location you need.
          </p>
        </div>

        <div className="rev-glow-box">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations egg locations"
            caption="Select an area or exact location below to jump to that short clip."
          />

          <div className="sk-selected-label">
            <span className="rev-selected-prefix">Area:</span> {currentCard.section}
            {selectedLocation && (
              <span className="rev-selected-location"> · {selectedLocation}</span>
            )}
          </div>

          <div className="sk-buttons" aria-label={`${currentCard.section} egg locations`}>
            {currentCard.locations.map((loc) => (
              <button
                key={loc.name}
                type="button"
                className={`sk-button ${selectedLocation === loc.name ? 'active' : ''}`}
                onClick={() => handleLocation(loc)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        <div className="egg-section-cards" aria-label="Revelations map areas">
          {eggData.map((section) => (
            <button
              type="button"
              key={section.section}
              className={`egg-glass-card clickable ${section.section === currentCard.section ? 'active' : ''}`}
              onClick={() => handleSelectCard(section)}
            >
              <span className="egg-card-kicker">Map Area</span>
              <span className="egg-subtitle">{section.section}</span>
              <span className="egg-card-count">{section.locations.length} possible locations</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EggLocations;
