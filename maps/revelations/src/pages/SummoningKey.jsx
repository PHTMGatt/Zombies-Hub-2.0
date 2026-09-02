import React, { useRef, useState } from 'react';
import GuideVideoPlayer from '../components/GuideVideoPlayer';
import SummoningKeyData from '../data/SummoningKey';
import '../styles/SummoningKey.css';

function SummoningKey() {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(SummoningKeyData[0]);

  const handleTimestampClick = (entry) => {
    setSelected(entry);
    videoRef.current?.playSegment(entry.start, entry.end);
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <div className="rev-page-heading">
          <span className="rev-page-kicker">Quick Reference</span>
          <h1 className="sk-title">Summoning Key Throws</h1>
          <p className="rev-page-intro">
            Each button jumps to the exact throw in the full guide so you can identify the target immediately.
          </p>
        </div>

        <div className="rev-glow-box">
          <GuideVideoPlayer
            ref={videoRef}
            title="Revelations Summoning Key throws"
            caption="Choose a throw below to play only that target segment."
          />

          <div className="sk-selected-label">
            <span className="rev-selected-prefix">Selected:</span> {selected.name}
          </div>

          <div className="sk-buttons" aria-label="Summoning Key throws">
            {SummoningKeyData.map((entry) => (
              <button
                key={entry.name}
                type="button"
                onClick={() => handleTimestampClick(entry)}
                className={`sk-button ${selected.name === entry.name ? 'active' : ''}`}
              >
                {entry.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummoningKey;
