import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import soundStepData from '../data/SoundStepData';
import '../styles/SoundStep.css';

const groupedData = soundStepData.reduce((acc, entry) => {
  if (!acc[entry.area]) acc[entry.area] = [];
  acc[entry.area].push(entry);
  return acc;
}, {});

const areaList = Object.keys(groupedData);

function timeToSeconds(value) {
  const [minutes, seconds] = value.trim().split(':').map(Number);
  return (minutes * 60) + seconds;
}

function getEndTime(entry) {
  const [, end] = entry.time.split('-');
  return end ? timeToSeconds(end) : undefined;
}

function SoundStep() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const videoRef = useRef(null);

  const handleRotate = (direction) => {
    setSelectedSpot(null);
    setCurrentIndex((previous) => (
      direction === 'left'
        ? (previous - 1 + areaList.length) % areaList.length
        : (previous + 1) % areaList.length
    ));
  };

  const handleClick = (spot) => {
    setSelectedSpot(`${spot.area} · ${spot.label}`);
    videoRef.current?.playSegment(spot.start, getEndTime(spot));
  };

  const getPosition = (index) => {
    if (index === currentIndex) return 'center';
    if ((index + 1) % areaList.length === currentIndex) return 'left';
    if ((index - 1 + areaList.length) % areaList.length === currentIndex) return 'right';
    return 'off';
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Audio Step Reference</span>
          <h1 className="sk-title">Sound Step</h1>
          <p className="rev-page-intro">
            Rotate between map areas, then choose a spot to jump directly to the matching sound location.
          </p>
        </div>

        <div className="rev-glow-box">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations sound step locations"
            caption="Select a spot from the active area to play that short location segment."
          />

          <div className="sk-selected-label">
            <span className="rev-selected-prefix">Area:</span> {areaList[currentIndex]}
            {selectedSpot && <span className="rev-selected-location"> · {selectedSpot.split(' · ')[1]}</span>}
          </div>

          <div className="carousel-wrapper">
            {areaList.map((area, index) => {
              const position = getPosition(index);
              if (position === 'off') return null;

              return (
                <div
                  key={area}
                  className={`sound-card ${position}`}
                  onClick={() => {
                    setSelectedSpot(null);
                    setCurrentIndex(index);
                  }}
                >
                  <div className="card-overlay" />
                  <h2 className="egg-subtitle">{area}</h2>
                  {position === 'center' && (
                    <div className="card-buttons">
                      {groupedData[area].map((spot) => (
                        <button
                          key={`${spot.area}-${spot.label}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleClick(spot);
                          }}
                        >
                          <span>{spot.label}</span>
                          <small>{spot.time}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="spinner-controls" aria-label="Change sound step area">
          <button type="button" onClick={() => handleRotate('left')} aria-label="Previous area">&larr;</button>
          <span>{currentIndex + 1} / {areaList.length}</span>
          <button type="button" onClick={() => handleRotate('right')} aria-label="Next area">&rarr;</button>
        </div>
      </div>
    </div>
  );
}

export default SoundStep;
