import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import eggData from '../data/eggData';
import '../styles/EggLocations.css';

const EggLocations = () => {
  const videoRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(eggData[0]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectCard = (section) => {
    setCurrentCard(section);
    setSelectedLocation(null);
    videoRef.current?.playSegment(section.sectionStart, section.sectionEnd);
  };

  const handleLocation = (location) => {
    setSelectedLocation(location.name);
    videoRef.current?.playSegment(location.start, location.end);
  };

  return (
    <main className="rev-page egg-locations-page">
      <div className="rev-background" />

      <div className="egg-reference">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Location Reference</span>
          <h1 className="sk-title">Egg Locations</h1>
          <p className="rev-page-intro">Choose the map area, then pick the spawn location you need.</p>
        </div>

        <div className="egg-area-tabs" aria-label="Revelations map areas">
          {eggData.map((section) => (
            <button
              type="button"
              key={section.section}
              className={section.section === currentCard.section ? 'active' : ''}
              onClick={() => handleSelectCard(section)}
            >
              {section.section}
            </button>
          ))}
        </div>

        <div className="rev-reference-card">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations egg locations"
            caption="Choose a location below to jump directly to that short clip."
          />

          <div className="sk-selected-label">
            <span className="rev-selected-prefix">Area:</span> {currentCard.section}
            {selectedLocation && <span className="rev-selected-location"> · {selectedLocation}</span>}
          </div>

          <div className="sk-buttons" aria-label={currentCard.section + ' egg locations'}>
            {currentCard.locations.map((loc) => (
              <button
                key={loc.name}
                type="button"
                className={selectedLocation === loc.name ? 'sk-button active' : 'sk-button'}
                onClick={() => handleLocation(loc)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EggLocations;
