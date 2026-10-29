import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import RevSectionHeader from '../components/RevSectionHeader';
import RevOptionList from '../components/RevOptionList';
import soundStepData from '../data/SoundStepData';
import '../styles/Reference.css';

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

  const options = groupedData[currentArea].map((spot) => ({
    ...spot,
    key: `${spot.area}-${spot.label}`,
    title: spot.label,
    meta: spot.time.replace(/\s*-\s*/, ' – '),
  }));

  return (
    <div className="rev-page rev-reference-page sound-step-page">
      <section className="rev-shell">
        <RevSectionHeader
          kicker="Rune Placement Reference · Step 09"
          title="Sound Step"
          intro="Pick the region you are checking, then the exact spot to hear that reference segment."
        />

        <div className="rev-workspace">
          <div className="rev-workspace__media">
            <GuideVideoPlayer
              ref={videoRef}
              title="Revelations Rune of Creation sound-step locations"
              caption="The video only jumps when you choose a spot."
              nowPlaying={selectedSpot ? `${currentArea} · ${selectedSpot.label}` : null}
            />
          </div>

          <aside className="rev-workspace__panel">
            <div className="rev-area-switch" role="group" aria-label="Change sound step area">
              <button type="button" onClick={() => handleRotate('left')} aria-label="Previous area">&larr;</button>
              <div>
                <span className="rev-kicker">Region {currentIndex + 1} / {areaList.length}</span>
                <strong>{currentArea}</strong>
              </div>
              <button type="button" onClick={() => handleRotate('right')} aria-label="Next area">&rarr;</button>
            </div>

            <RevOptionList
              label={`${currentArea} sound step locations`}
              options={options}
              activeKey={selectedSpot ? `${selectedSpot.area}-${selectedSpot.label}` : null}
              onSelect={handleClick}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}

export default SoundStep;
