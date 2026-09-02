import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import upgradeData from '../data/ApothiconUpgradeData';
import '../styles/ApothiconUpgrade.css';

const ApothiconUpgrade = () => {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(upgradeData[0]);

  const handlePlay = (item) => {
    setSelected(item);
    videoRef.current?.playSegment(item.start, item.end);
  };

  return (
    <div className="rev-page apothicon-upgrade-page">
      <div className="rev-background" />
      <div className="sk-container">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Quick Reference</span>
          <h1 className="sk-title">Apothicon Servant Upgrade</h1>
          <p className="rev-page-intro">Choose the area you need and jump directly to that short location segment.</p>
        </div>

        <div className="rev-glow-box">
          <GuideVideoPlayer
            ref={videoRef}
            title="Apothicon Servant upgrade locations"
            caption="Choose an area below to play only that location segment."
          />

          <div className="sk-selected-label">
            <span className="rev-selected-prefix">Selected:</span> {selected.name}
          </div>

          <div className="sk-buttons" aria-label="Apothicon upgrade locations">
            {upgradeData.map((item) => (
              <button
                key={item.name}
                type="button"
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
