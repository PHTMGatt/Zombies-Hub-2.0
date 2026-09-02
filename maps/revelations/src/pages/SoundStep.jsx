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
    setSelectedSpot(spot);
    videoRef.current?.playSegment(spot.start, getEndTime(spot));
  };

  const getPosition = (index) => {
    if (index === currentIndex) return 'center';
    if ((index + 1) % areaList.length === currentIndex) return 'left';
    if ((index - 1 + areaList.length) % areaList.length === currentIndex) return 'right';
    return 'off';
  };

  return (
    <main className="rev-page sound-step-page">
      <div className="rev-background" />
      <div className="sk-container">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Rune Placement Reference</span>
          <h1 className="sk-title">Sound Step</h1>
          <p className="rev-page-intro">
            Rotate to the region you are checking, then tap the exact location to play only that short reference segment.
          </p>
        </div>

        <div className="rev-glow-box sound-workspace">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations Rune of Creation sound-step locations"
            caption="The video only jumps when you choose a location."
          />

          <div className="sound-picker">
            <div className="sk-selected-label">
              <span className="rev-selected-prefix">Area:</span> {areaList[currentIndex]}
              {selectedSpot && <span className="rev-selected-location"> · {selectedSpot.label}</span>}
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
                            className={selectedSpot?.label === spot.label ? 'active' : ''}
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

            <div className="spinner-controls" aria-label="Change sound step area">
              <button type="button" onClick={() => handleRotate('left')} aria-label="Previous area">&larr;</button>
              <span>{currentIndex + 1} / {areaList.length}</span>
              <button type="button" onClick={() => handleRotate('right')} aria-label="Next area">&rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SoundStep;
