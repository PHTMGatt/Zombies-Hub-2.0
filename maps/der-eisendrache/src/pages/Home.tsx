// src/pages/Home.tsx

import React, { useRef } from 'react';
import '../styles/pages/Home.css';
import { deGuide } from '../data/deGuide';

const Home: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const seekTo = (time: string) => {
    const [min = 0, sec = 0] = time.split(':').map(Number);
    const seconds = min * 60 + sec;

    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seconds, true],
      }),
      '*'
    );
  };

  return (
    <div className="home-page-container">
      <div className="home-page">
        <h1 className="home-page__title">Der Eisendrache EE Guide</h1>
        <p className="home-page__intro">
          Follow each step below to complete the quest.
        </p>

        {typeof deGuide.videoUrl === 'string' && (
          <div className="video-wrapper">
            <iframe
              ref={iframeRef}
              className="youtube-frame"
              src={deGuide.videoUrl}
              title="Der Eisendrache EE Guide Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}

        <h2 className="home-page__section">Main Easter Egg Steps</h2>

        {Array.isArray(deGuide.mainEE) && deGuide.mainEE.length > 0 && (
          <div className="step-grid">
            {deGuide.mainEE.map((step, idx) => (
              <button
                key={idx}
                className="step-item"
                onClick={() => seekTo(step.time)}
                title={`Jump to ${step.time}`}
                type="button"
              >
                <span className="step-index">{idx + 1}.</span> {step.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
