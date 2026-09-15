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
  const currentArea = areaList[currentIndex];

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

  return (
    <main className="rev-page sound-step-page">
      <div className="rev-background" />

      <div className="sound-reference">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Rune Placement Reference</span>
          <h1 className="sk-title">Sound Step</h1>
          <p className="rev-page-intro">
            Pick the region you are checking, then choose the exact location to hear that reference segment.
          </p>
        </div>

        <div className="rev-reference-card">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations Rune of Creation sound-step locations"
            caption="The video only jumps when you choose a location."
          />

          <div className="sound-area-controls" aria-label="Change sound step area">
            <button type="button" onClick={() => handleRotate('left')} aria-label="Previous area">&larr;</button>
            <strong>{currentArea}</strong>
            <span>{currentIndex + 1} / {areaList.length}</span>
            <button type="button" onClick={() => handleRotate('right')} aria-label="Next area">&rarr;</button>
          </div>

          <div className="sound-location-list" aria-label={currentArea + ' sound step locations'}>
            {groupedData[currentArea].map((spot) => (
              <button
                key={spot.area + '-' + spot.label}
                type="button"
                className={selectedSpot?.label === spot.label ? 'active' : ''}
                onClick={() => handleClick(spot)}
              >
                <span>{spot.label}</span>
                <small>{spot.time}</small>
              </button>
            ))}
          </div>

          {selectedSpot && (
            <div className="sk-selected-label">
              <span className="rev-selected-prefix">Selected:</span> {selectedSpot.label}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SoundStep;
