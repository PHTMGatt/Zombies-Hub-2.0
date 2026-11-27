import React, { useRef } from 'react';
import SummoningKeyData from '../data/SummoningKey';
import YouTube from 'react-youtube';
import '../styles/SummoningKey.css';

function SummoningKey() {
  const playerRef = useRef(null);

  const handleTimestampClick = (start) => {
    if (playerRef.current) {
      playerRef.current.seekTo(start, true);
      playerRef.current.playVideo();
    }
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const opts = {
    width: '100%',
    height: '400',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <h1 className="sk-title">Summoning Key Throws</h1>

        <div className="rev-glow-box">
          <div className="video-card">
            <YouTube
              videoId="tt3mpH7Rrfo"
              opts={opts}
              onReady={onPlayerReady}
              className="sk-video"
            />
            <div className="video-caption">(Choose a throw location to jump in the video)</div>
          </div>

          <div className="sk-selected-label">Choose a Throw</div>

          <div className="sk-buttons">
            {SummoningKeyData.map((entry, index) => (
              <button
                key={index}
                onClick={() => handleTimestampClick(entry.start)}
                className="sk-button"
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
