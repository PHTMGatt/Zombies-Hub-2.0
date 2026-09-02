import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import YouTube from 'react-youtube';

const GuideVideoPlayer = forwardRef(function GuideVideoPlayer(
  {
    videoId = 'tt3mpH7Rrfo',
    title = 'Revelations guide video',
    caption = 'Choose a section to jump directly to that part of the guide.',
  },
  ref,
) {
  const playerRef = useRef(null);
  const stopTimerRef = useRef(null);

  const clearStopTimer = () => {
    if (stopTimerRef.current) {
      window.clearInterval(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  const playSegment = (start, end) => {
    const player = playerRef.current;
    if (!player) return false;

    clearStopTimer();
    player.seekTo(start, true);
    player.playVideo();

    if (typeof end === 'number' && end > start) {
      stopTimerRef.current = window.setInterval(() => {
        const current = playerRef.current?.getCurrentTime?.();
        if (typeof current === 'number' && current >= end) {
          playerRef.current?.pauseVideo?.();
          clearStopTimer();
        }
      }, 250);
    }

    return true;
  };

  useImperativeHandle(ref, () => ({
    playSegment,
    seekTo(start) {
      return playSegment(start);
    },
  }));

  useEffect(() => clearStopTimer, []);

  const opts = {
    width: '100%',
    height: '400',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
  };

  return (
    <div className="video-card rev-video-player">
      <YouTube
        videoId={videoId}
        opts={opts}
        title={title}
        onReady={(event) => {
          playerRef.current = event.target;
        }}
        className="sk-video"
        iframeClassName="rev-video-player__iframe"
      />
      <div className="video-caption">{caption}</div>
    </div>
  );
});

export default GuideVideoPlayer;
