import React, { useState } from 'react';
import '../styles/EggLocations.css';
import eggData from '../data/eggData';

const EggLocations = () => {
  const [videoTimes, setVideoTimes] = useState({ start: 380, end: 540 });
  const [autoplay, setAutoplay] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  const handlePlaySection = (start, end) => {
    setVideoTimes({ start, end });
    setAutoplay(true);
  };

  const handleSelectCard = (section) => {
    setCurrentCard(section);
    handlePlaySection(section.sectionStart, section.sectionEnd);
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <h1 className="sk-title" onClick={() => handlePlaySection(380, 400)}>
          Egg Locations
        </h1>

        <div className="rev-glow-box">
          <div className="video-card">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/tt3mpH7Rrfo?start=${videoTimes.start}&end=${videoTimes.end}&autoplay=${autoplay ? 1 : 0}&rel=0`}
              title="Egg Locations"
              frameBorder="0"
              allowFullScreen
            />
            <div className="video-caption">(Click a section or location to play)</div>
          </div>

          {currentCard && (
            <>
              <div className="sk-selected-label">{currentCard.section}</div>
              <div className="sk-buttons">
                {currentCard.locations.map((loc, i) => (
                  <button
                    key={i}
                    className="sk-button"
                    onClick={() => handlePlaySection(loc.start, loc.end)}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Below box: all selectable section cards */}
        <div className="egg-section-cards">
          {eggData.map((section, index) => (
            section !== currentCard && (
              <div
                key={index}
                className="egg-glass-card clickable"
                onClick={() => handleSelectCard(section)}
              >
                <h2 className="egg-subtitle">{section.section}</h2>
                {section.locations.map((loc, idx) => (
                  <p key={idx} className="egg-text">- {loc.name}</p>
                ))}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default EggLocations;
