// VideoPlayer.tsx
// ------------------

import React, { useRef } from 'react';
import '../styles/components/VideoPlayer.css';

interface VideoStep {
  time: string;
  label: string;
}

interface VideoPlayerProps {
  url: string;
  steps?: VideoStep[];
  credit?: {
    author: string;
    link: string;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, steps = [], credit }) => {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const timeToSeconds = (t: string) => {
    const [min, sec] = t.split(':').map(Number);
    return min * 60 + sec;
  };

  const seekTo = (time: string) => {
    const seconds = timeToSeconds(time);
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seconds, true],
      }),
      '*'
    );
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: [],
      }),
      '*'
    );
  };

  const iframeSrc = steps.length > 0
    ? `${url}${url.includes('?') ? '&' : '?'}enablejsapi=1`
    : url;

  return (
    <div className="video-player">
      <div className="video-wrapper">
        <iframe
          ref={playerRef}
          src={iframeSrc}
          title="Video Guide"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      </div>

      {credit && (
        <p className="video-credit">
          Video by{' '}
          <a href={credit.link} target="_blank" rel="noopener noreferrer">
            {credit.author}
          </a>
        </p>
      )}

      {steps.length > 0 && (
        <ul className="video-steps">
          {steps.map((step, i) => (
            <li key={i} onClick={() => seekTo(step.time)}>
              {step.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoPlayer;
