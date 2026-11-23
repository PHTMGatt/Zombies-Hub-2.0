import React, { useState } from 'react';
import upgradeData from '../data/ApothiconUpgradeData';
import '../styles/ApothiconUpgrade.css';

const ApothiconUpgrade = () => {
  const [selected, setSelected] = useState(upgradeData[0]);
  const [videoTimes, setVideoTimes] = useState({ start: selected.start, end: selected.end });
  const [autoplay, setAutoplay] = useState(false);

  const handlePlay = (item) => {
    setSelected(item);
    setVideoTimes({ start: item.start, end: item.end });
    setAutoplay(true);
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <h1 className="sk-title">Apothicon Upgrade Locations</h1>

        <div className="rev-glow-box">
          <div className="video-card">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/tt3mpH7Rrfo?start=${videoTimes.start}&end=${videoTimes.end}&autoplay=${autoplay ? 1 : 0}&rel=0`}
              title="Apothicon Upgrade Video"
              frameBorder="0"
              allowFullScreen
            />
            <div className="video-caption">(Click a section or location to play)</div>
          </div>

          <div className="sk-selected-label">{selected.name}</div>

          <div className="sk-buttons">
            {upgradeData.map((item, index) => (
              <button
                key={index}
                onClick={() => handlePlay(item)}
                className={`sk-button ${selected.name === item.name ? 'active' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApothiconUpgrade;
